/*
  @author apendua / apendua@gmail.com
*/

Spline = function (controlPoints) {
  this.controlPoints = controlPoints || [];
};

_.extend(Spline.prototype, {
  push: function (controlPoint) {
    //TODO: debug mode should produce nicer source code, otherwise it should be minified
    //QUESTION: maybe we should use list of coordinates (?)
    // at this moment the control point
    // must be an object of type:
    // {
    //   co: { x: 0, y: 0 },
    // }
    this.controlPoints.push(controlPoint);
  },
  compile: function () {
    //TODO: test & optimize
    //TODO: implement degree 3 curves
    //TODO: implement multi-dimensional curves
    //TODO: make sure that the points are sorted
    //TODO: fill in missing data for selected dimensions
    //      so that not every coordinate has to be defined for
    //      each control point
    var half = Math.floor(this.controlPoints.length / 2);
    //---------------------------------------------------
    if (this.controlPoints.length <= 2) {
      var cp0 = this.controlPoints[0];
      var cp1 = this.controlPoints[1];
      if (cp1 !== undefined) {
        var a = (cp1.co.y - cp0.co.y) / (cp1.co.x - cp0.co.x);
        var b = cp0.co.y - a * cp0.co.x;
        this.source = [ "return " + a + " * t + " + b + ";" ];
      } else if (cp0 !== undefined) {
        this.source = [ "return " + cp0.co.y ];
      } else // this is wrong :/
        throw new Error("cannot compile spline with no control points");
    } else {
      var spline1 = new Spline(this.controlPoints.slice(0,half+1));
      var spline2 = new Spline(this.controlPoints.slice(half));
      var cp = this.controlPoints[half];
      var source = [];
      source.push("if (t < " + cp.co.x + ") {");
        _.each(spline1.compile(), function (lineOfCode) {
          source.push("  " + lineOfCode);
        });
      source.push("} else {");
        _.each(spline2.compile(), function (lineOfCode) {
          source.push("  " + lineOfCode);
        });
      source.push("}");
      this.source = source;
    }
    delete this.fn; // make sure this will be updated on the next call to evaluate
    return this.source;
  },
  evaluate: function (frame) {
    if (!this.fn) {
      if (!this.source)
        this.source = this.compile();
      this.fn = new Function ("t", this.source.join("\n"));
    }
    return this.fn(frame);
  },
  naive: function (frame) {
    //TODO: make it work better ;)
    var i = 0;
    while (this.controlPoints[i].co.x < frame) i++;
    var cp0 = this.controlPoints[i-1];
    var cp1 = this.controlPoints[i];
    return cp0.co.y + ( frame - cp0.co.x) * (cp1.co.y - cp0.co.y) / (cp1.co.x - cp0.co.x);
  }
});
