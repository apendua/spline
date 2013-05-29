# spline

## Usage

To define a new curve type
```javascript
var curve = new Spline;
```
Now you can add control points to your curve like this:
```javascript
curve.push({
  co: { x: 0, y: 1 },
});
curve.push({
  co: { x: 1, y: 2 },
});
curve.push({
  co: { x: 4, y: -5 },
});
```
and evaluate the curve at any point
```javascript
curve.evaluate(1.1111);
```
Please note that the evaluation function of your curve
will be compiled as soon as you call `curve.evaluate`
for the first time. This may require some additional
computation time.
