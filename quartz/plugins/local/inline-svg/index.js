import fs from "fs"
import path from "path"
import { fromHtml } from "hast-util-from-html"
import { visit } from "unist-util-visit"

const stripQuery = (src) => src.split("?")[0].split("#")[0]

const isLocalSvg = (src) =>
  typeof src === "string" &&
  !/^[a-z][a-z0-9+.-]*:/i.test(src) &&
  stripQuery(src).toLowerCase().endsWith(".svg")

function resolveSource(ctx, file, src) {
  const relative = decodeURIComponent(stripQuery(src)).replace(/^\.\//, "")
  const candidates = []
  const filePath = file.data?.filePath
  if (filePath) {
    candidates.push(path.join(path.dirname(filePath), relative))
  }
  candidates.push(path.join(ctx.argv.directory, relative.replace(/^\/+/, "")))
  return candidates.find((candidate) => fs.existsSync(candidate))
}

function readSvgElement(filePath) {
  const tree = fromHtml(fs.readFileSync(filePath, "utf8"), { fragment: true })
  let svg
  visit(tree, "element", (node) => {
    if (!svg && node.tagName === "svg") {
      svg = node
    }
  })
  return svg
}

function applyAlt(svg, alt) {
  const properties = (svg.properties ??= {})
  if (!properties.role) {
    properties.role = "img"
  }
  if (alt && !properties.ariaLabel && !properties.ariaLabelledBy) {
    properties.ariaLabel = alt
  }
}

const InlineSvg = () => ({
  name: "InlineSvg",
  htmlPlugins(ctx) {
    return [
      () => (tree, file) => {
        visit(tree, "element", (node, index, parent) => {
          if (node.tagName !== "img" || !parent || index === undefined) return
          const src = node.properties?.src
          if (!isLocalSvg(src)) return

          const resolved = resolveSource(ctx, file, src)
          if (!resolved) {
            console.warn(`InlineSvg: could not resolve "${src}" from ${file.data?.filePath}`)
            return
          }

          const svg = readSvgElement(resolved)
          if (!svg) {
            console.warn(`InlineSvg: no <svg> root element in ${resolved}`)
            return
          }

          applyAlt(svg, node.properties?.alt)
          parent.children[index] = svg
          return index + 1
        })
      },
    ]
  },
})

export default InlineSvg
