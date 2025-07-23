class Game{
   constructor(canvas, editMode = false){
      this.currentLevel = 0;
      this.levels = levels;
      this.corridorColor="#FA0";
      this.targetColor="#F00";
      this.ctx = canvas.getContext("2d");
      this.ctx.strokeStyle = this.corridorColor;

      this.started=false;
      this.gameOver=false;
      this.img=new Image();
      this.img.src="res/scary.png";

      this.audio=new Audio();
      this.audio.src="res/scream.mp3";

      if(editMode){
         this.editor=new Editor(canvas, this.drawPaths, this.corridorColor, this.targetColor);
      }else{
         this.drawPaths(this.levels[this.currentLevel]);
      }
      
      this.addEventListeners(canvas);
   }

   addEventListeners(canvas) {
      canvas.addEventListener("contextmenu", (e) => {
         e.preventDefault();
      });

      canvas.addEventListener("mousedown", (e) => {
         if(this.started){
            return;
         }
         const imgData = this.ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
         const g = imgData.data[1];
         const a = imgData.data[3];
         if (a == 0) {
         } else {
            if (g == 0) {
               this.started=true;
               this.increaseLevel();
            } 
         }
      });
      canvas.addEventListener("mousemove", (e) => {
         if(!this.started || this.gameOver){
            return;
         }
         const imgData = this.ctx.getImageData(e.offsetX, e.offsetY, 1, 1);
         const g = imgData.data[1];
         const a = imgData.data[3];
         if (a == 0) {
            this.doGameOver();
         } else {
            if (g == 0) {
               this.increaseLevel();
            } else {
            }
         }
      });
   }

   doGameOver(){
      this.gameOver=true;
      this.ctx.drawImage(this.img, 0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.audio.play();
      this.started=false;
   }

   increaseLevel(){
      if(this.currentLevel==this.levels.length-1){
         this.gameOver=true;
         this.ctx.font = "30px Arial";
         this.ctx.fillStyle="white";
         this.ctx.strokeStyle="black";
         this.ctx.textAlign="center";
         this.ctx.textBaseline="middle";
         this.ctx.lineWidth=1;
         doGameOver();
         this.started=false;
         return;
      }
      this.currentLevel++;
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.drawPaths(this.levels[this.currentLevel]);
      doGameOver();
   }

   drawPaths(paths) {
      for (const path of paths) {
         this.ctx.beginPath();
         this.ctx.lineWidth = path.width;
         this.ctx.moveTo(path.start.x, path.start.y);
         this.ctx.lineTo(path.end.x, path.end.y);
         if(path.type=="target"){
            this.ctx.strokeStyle = this.targetColor;
         }else{
            this.ctx.strokeStyle = this.corridorColor;
         }
         this.ctx.stroke();
         if(path.text){
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle="black";
            this.ctx.textAlign="center";
            this.ctx.textBaseline="middle";
            const avg={
               x:(path.start.x+path.end.x)/2,
               y:(path.start.y+path.end.y)/2
            }
            this.ctx.fillText(path.text, avg.x, avg.y);
         }
      }
   }
}
