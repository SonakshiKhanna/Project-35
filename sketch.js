//Create variables here
var database;
var dog, dogimg, happyDog,textColor,value;
var foodS,foodStock
var feed, addFood;
var foodObj;
var lastFed, fedTime;

function preload(){
  dogimg = loadImage("images/dogImg.png");
  happyDog = loadImage("images/dogImg1.png");
}

function setup() {
  createCanvas(500,500);
    
  database = firebase.database();


  foodObj = new Food(20,100,10,30);

  foodStock = database.ref('Food');
  foodStock.on("value",readStock);
  
  dog = createSprite(200,300,10,10);
  dog.addImage(dogimg);
  dog.scale = 0.15
  
  feed = createButton("Feed the Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood = createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);
}


function draw() {  

  background(46, 139, 87);

  // if(keyWentDown(UP_ARROW)){
  //   writeStock(foodS);
  //   dog.addImage(happyDog);
  // }

  foodObj.display();

  fedTime = database.ref("FeedTime");

  fedTime.on("value",function(data){
    lastFed = data.val();
  });

  fill(255,255,254);
  textSize(15);
  if(lastFed>=12){
    text("Last Feed:" + lastFed%12 + "PM", 350, 30);
  }else if(lastFed===0){
    text("Last Feed: 12AM", 350,30);
  }else{
    text("Last Feed:" + lastFed + "AM", 350,30);
  }

  drawSprites();
}

function readStock(data) {
  foodS = data.val();
  foodObj.updateFoodStock(foodS);

}

function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    fedTime:hour()
  })
}

function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
  
}