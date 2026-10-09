---
title: Как брать производную
tags:
  - производная
  - анализ
---

# Как брать производную

Производная показывает скорость изменения функции.

## Основные формулы

$$
(x^n)' = nx^{n-1}
$$

$$
(\sin x)' = \cos x
$$

$$
(\cos x)' = -\sin x
$$

$$
(e^x)' = e^x
$$

## Правила

### Производная суммы

$$
(f + g)' = f' + g'
$$

### Производная произведения

$$
(fg)' = f'g + fg'
$$

### Производная сложной функции

$$
f(g(x))' = f'(g(x))g'(x)
$$

## Секущая и касательная

Производная в точке — это предел наклона секущей, когда второй точке дают приближаться к первой:

$$
f'(x_0) = \lim_{h \to 0} \frac{f(x_0 + h) - f(x_0)}{h}
$$

Подвигай ползунки: синяя прямая — касательная с наклоном $f'(x_0)$, серая пунктирная — секущая через точки $x_0$ и $x_0 + h$. Чем меньше $h$, тем ближе они друг к другу.

<div class="tangent-lab" id="tangent-lab">
<div class="tangent-lab-tabs">
<button type="button" class="tangent-lab-tab is-active" data-fn="parabola">f(x) = x²</button>
<button type="button" class="tangent-lab-tab" data-fn="sine">f(x) = sin x</button>
<button type="button" class="tangent-lab-tab" data-fn="cubic">f(x) = x³ − 3x</button>
</div>
<canvas class="tangent-lab-canvas" id="tangent-lab-canvas"></canvas>
<div class="tangent-lab-controls">
<label>Точка x₀ <input type="range" id="tangent-lab-x0" min="-260" max="260" value="70"></label>
<label>Шаг h <input type="range" id="tangent-lab-h" min="2" max="180" value="140"></label>
</div>
<p class="tangent-lab-readout" id="tangent-lab-readout"></p>
</div>

<style>
.tangent-lab {
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  padding: 1rem;
  margin: 1.5rem 0;
}
.tangent-lab-tabs {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.tangent-lab-tab {
  flex: 1 1 8rem;
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--lightgray);
  border-radius: 5px;
  background: transparent;
  color: var(--darkgray);
  font-family: inherit;
  font-size: 0.9rem;
  cursor: pointer;
}
.tangent-lab-tab:hover {
  background: var(--lightgray);
}
.tangent-lab-tab.is-active {
  border-color: var(--secondary);
  color: var(--secondary);
}
.tangent-lab-canvas {
  display: block;
  width: 100%;
  height: 340px;
  margin: 1rem 0 0.5rem;
}
.tangent-lab-controls {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
}
.tangent-lab-controls label {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex: 1 1 12rem;
  font-size: 0.85rem;
  color: var(--gray);
  white-space: nowrap;
}
.tangent-lab-controls input {
  flex: 1;
  min-width: 6rem;
  accent-color: var(--secondary);
}
.tangent-lab-readout {
  margin: 0.9rem 0 0;
  font-family: var(--codeFont);
  font-size: 0.8rem;
  line-height: 1.6;
  color: var(--darkgray);
}
</style>

<script>
;(function () {
  var root = document.getElementById("tangent-lab")
  if (!root) return
  if (window.__tangentLabCleanup) window.__tangentLabCleanup()

  var canvas = document.getElementById("tangent-lab-canvas")
  var ctx = canvas.getContext("2d")
  var x0Input = document.getElementById("tangent-lab-x0")
  var hInput = document.getElementById("tangent-lab-h")
  var readout = document.getElementById("tangent-lab-readout")
  var tabs = root.querySelectorAll(".tangent-lab-tab")

  var FNS = {
    parabola: {
      f: function (x) { return x * x },
      df: function (x) { return 2 * x },
    },
    sine: {
      f: function (x) { return Math.sin(x) },
      df: function (x) { return Math.cos(x) },
    },
    cubic: {
      f: function (x) { return x * x * x - 3 * x },
      df: function (x) { return 3 * x * x - 3 },
    },
  }

  var current = "parabola"
  var W = 0
  var H = 0
  var scale = 1

  function css(name) {
    return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  }

  function px(x) { return W / 2 + x * scale }
  function py(y) { return H / 2 - y * scale }
  function ux(p) { return (p - W / 2) / scale }

  function stroke(x1, y1, x2, y2) {
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
  }

  function dot(x, y, color, filled) {
    ctx.beginPath()
    ctx.arc(px(x), py(y), 4.5, 0, Math.PI * 2)
    if (filled) {
      ctx.fillStyle = color
      ctx.fill()
    } else {
      ctx.fillStyle = css("--light")
      ctx.fill()
      ctx.strokeStyle = color
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }

  function draw() {
    var fn = FNS[current]
    var x0 = Number(x0Input.value) / 65
    var h = Number(hInput.value) / 100
    var y0 = fn.f(x0)
    var slope = fn.df(x0)
    var x1 = x0 + h
    var y1 = fn.f(x1)
    var secant = (y1 - y0) / h
    var left = ux(0)
    var right = ux(W)

    ctx.clearRect(0, 0, W, H)

    ctx.strokeStyle = css("--lightgray")
    ctx.lineWidth = 1
    for (var gx = Math.ceil(left); gx <= right; gx++) stroke(px(gx), 0, px(gx), H)
    for (var gy = Math.ceil(-H / 2 / scale); gy <= H / 2 / scale; gy++) stroke(0, py(gy), W, py(gy))

    ctx.strokeStyle = css("--gray")
    ctx.lineWidth = 1.5
    stroke(0, py(0), W, py(0))
    stroke(px(0), 0, px(0), H)

    ctx.setLineDash([5, 5])
    ctx.strokeStyle = css("--gray")
    ctx.lineWidth = 1.5
    stroke(px(left), py(y0 + secant * (left - x0)), px(right), py(y0 + secant * (right - x0)))
    ctx.setLineDash([])

    ctx.strokeStyle = css("--secondary")
    ctx.lineWidth = 2
    stroke(px(left), py(y0 + slope * (left - x0)), px(right), py(y0 + slope * (right - x0)))

    ctx.strokeStyle = css("--dark")
    ctx.lineWidth = 2.5
    ctx.beginPath()
    for (var p = 0; p <= W; p += 1) {
      var y = fn.f(ux(p))
      if (p === 0) ctx.moveTo(p, py(y))
      else ctx.lineTo(p, py(y))
    }
    ctx.stroke()

    dot(x1, y1, css("--gray"), false)
    dot(x0, y0, css("--secondary"), true)

    readout.textContent =
      "x₀ = " + x0.toFixed(2) +
      "   h = " + h.toFixed(2) +
      "   |   наклон секущей = " + secant.toFixed(3) +
      "   f'(x₀) = " + slope.toFixed(3) +
      "   |   разница = " + Math.abs(secant - slope).toFixed(3)
  }

  function resize() {
    var dpr = window.devicePixelRatio || 1
    W = canvas.clientWidth
    H = canvas.clientHeight
    canvas.width = Math.round(W * dpr)
    canvas.height = Math.round(H * dpr)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    scale = H / 5.6
    draw()
  }

  var off = []
  function on(el, type, fn) {
    el.addEventListener(type, fn)
    off.push(function () { el.removeEventListener(type, fn) })
  }

  on(x0Input, "input", draw)
  on(hInput, "input", draw)
  on(document, "themechange", draw)
  for (var i = 0; i < tabs.length; i++) {
    on(tabs[i], "click", function (e) {
      current = e.currentTarget.dataset.fn
      for (var j = 0; j < tabs.length; j++) tabs[j].classList.toggle("is-active", tabs[j] === e.currentTarget)
      draw()
    })
  }

  var ro = new ResizeObserver(resize)
  ro.observe(canvas)

  function cleanup() {
    off.forEach(function (fn) { fn() })
    ro.disconnect()
    window.__tangentLabCleanup = null
  }
  window.__tangentLabCleanup = cleanup
  if (typeof window.addCleanup === "function") window.addCleanup(cleanup)

  resize()
})()
</script>

## Где используется

Производная особенно важна в теме [[function-research|Исследование функции]].

Также она периодически возникает в [[parameters|задачах с параметрами]].