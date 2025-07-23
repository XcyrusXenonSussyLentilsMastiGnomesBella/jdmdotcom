class Editor {
   constructor(canvas, drawPaths, corridorColor, targetColor) {
      this.lineWidth = 120;
      this.paths = [];
      this.lineStart = null;
      this.lineEnd = null;
      this.pathType = "corridor";
      this.corridorColor = corridorColor;
      this.targetColor = targetColor;

      this.ctx = canvas.getContext("2d");
      this.drawPaths = drawPaths;
      this.addEventListeners(canvas);
   }

   addEventListeners(canvas) {
      window.addEventListener("keydown", (e) => {
         if (e.key == "t") {
            this.pathType = "target";
         }
      });
      window.addEventListener("keyup", (e) => {
         if (e.key == "t") {
            this.pathType = "corridor";
         }
      });

      canvas.addEventListener("wheel", (e) => {
         this.lineWidth -= 10 * Math.sign(e.deltaY);
         this.lineWidth = Math.max(10, this.lineWidth);
         this.drawIntent(e);
      });

      canvas.addEventListener("pointerdown", (e) => {
         const x = e.offsetX;
         const y = e.offsetY;
         this.lineStart = { x, y };
      });

      canvas.addEventListener("pointerup", (e) => {
         const x = e.offsetX;
         const y = e.offsetY;
         this.lineEnd = this.snap(x, y);
         if (this.lineStart != null) {
            this.paths.push({
               start: this.lineStart,
               end: this.lineEnd,
               width: this.lineWidth,
               type: this.pathType,
            });
            this.drawPaths(this.paths);
            this.lineStart = null;
            this.lineEnd = null;
         }
      });

      canvas.addEventListener("pointermove", (e) => {
         this.drawIntent(e);
      });
   }

   drawIntent(e) {
      const x = e.offsetX;
      const y = e.offsetY;
      if (this.lineStart != null) {
         this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
         this.drawPaths(this.paths);

         // Draw a line from the start to the mouse position
         this.ctx.globalAlpha = 0.5;
         this.ctx.beginPath();

         this.ctx.lineWidth = this.lineWidth;
         this.ctx.strokeStyle =
            this.pathType == "target" ? this.targetColor : this.corridorColor;
         this.ctx.moveTo(this.lineStart.x, this.lineStart.y);
         const snappedPoint = this.snap(x, y);
         this.ctx.lineTo(snappedPoint.x, snappedPoint.y);
         this.ctx.stroke();
         this.ctx.globalAlpha = 1;
      } else {
         this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
         this.drawPaths(this.paths);

         // Draw a circle at the mouse position
         this.ctx.save();
         this.ctx.beginPath();
         this.ctx.arc(x, y, this.lineWidth / 2, 0, 2 * Math.PI);
         this.ctx.lineWidth = 2;
         this.ctx.strokeStyle =
            this.pathType == "target" ? this.targetColor : "gray";
         this.ctx.setLineDash([5, 5]);
         this.ctx.stroke();
         this.ctx.restore();
      }
   }

   snap(x, y) {
      const snappedPoint = { x: 0, y: 0 };
      const xDist = Math.abs(x - this.lineStart.x);
      const yDist = Math.abs(y - this.lineStart.y);
      if (xDist > yDist) {
         snappedPoint.x = x;
         snappedPoint.y = this.lineStart.y;
      } else {
         snappedPoint.x = this.lineStart.x;
         snappedPoint.y = y;
      }
      return snappedPoint;
   }
}
