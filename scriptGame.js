setInterval(function(){time()},1000);
var sec = -1;
var rightResult=0;
var missedCurrentRound=0;
var wrongResult=0;
var missedResult=0;
var round=0;
var numberOfEl, animals, interval;

function time()
{
    if(sec>-1){
        $('#time').html(sec++);
    }
}

function start(){
	var size, time;
	var rows, cols;
	
	if($('#size2x3').is(':checked')) {
		size=$('#size2x3').val();
	}
	else if ($('#size3x4').is(':checked')) {
		size = $('#size3x4').val();
	}
	
	if($('#time1').is(':checked')) {
		time = $('#time1').val();
	}
	else if ($('#time2').is(':checked')) {
		time = $('#time2').val();
	}
	else if ($('#time3').is(':checked')) {
		time = $('#time3').val();
	}
	rows = Number(size.substring(0,1));
	cols = Number(size.substring(2));
	time=Number(time);
	
    board = new GameBoard(rows, cols, time);	
    sec=0;
	$("#playButton").unbind("click");
}

function GameBoard(rows, cols, time) {
    this.rows = rows;
    this.cols = cols;
	this.time = time;

	var counterBoard=0;		//to choose directory's number
	var counterPic=0;
	var picArray;
	var pickedEl;
	
	numberOfEl = rows*cols;
	animals= numberOfEl/3;

	var interval = function(){ 	
		picArray = new pictureArray(numberOfEl, counterBoard);
		$(".row").remove();							// remove previous board
		$(".col").remove();

		for(var i=0; i<rows; i++){
			$("#boardGame").append("<div class=row id=row"+i+"> ");
			for(var j=0; j<cols; j++){
				pickedEl=picArray[counterPic].src.toString();
				$("#boardGame #row"+i).append("<span class=col ><img id="+i+"_"+j+" class=image onclick='clickElement(\""+i+"_"+j+"\","+counterBoard+");' src='"+pickedEl+"'>"); 
				counterPic++;	
			}
		}
		
		counterPic=0;
		counterBoard++;
		round++;
		missedResult+= missedCurrentRound;
		$('#missedResultText').html(missedResult);
		updateResults();
		
		if(animals<4) {
			missedCurrentRound=animals;
		}
		else {
			missedCurrentRound=animals;
		} 

		if(counterBoard==26)		//ilość plansz gry
		{
			try{
				clearInterval(this);
				showResultBoard();
			}
			catch(e){
				console.log('game has ended');
			}
		}
	};
	interval();
	setInterval(interval, time*1000);
	
}

function pictureArray(n, nFolder) {
	var array= new Array(n);
	for(var i=0; i<n; i++) {
		array[i] = new Image();
		array[i].src = 'Pictures/'+nFolder+'/'+i+'.jpg';	
	}
	return array;
}

function clickElement(elId, r) {
	var element = document.getElementById(elId);
	var path = element.src.toString();
	var el = Number(path.substring(path.lastIndexOf('/')+1, path.length-4)); //numebr of picture
	var animal = false;

	if(r%5==0){
		if((el+1)%3==0) 
			animal=true;
	}
	else if (r%4==0) {
		if(el==1 || el==5 || el==7 || el==8) 
			animal=true;
	}
	else if (r%3==0) {
		if((el+3)%3==0) 
			animal=true;
	}
	else {
		if((el+2)%3==0) 
			animal=true;
	}

	if(animal) { 
		element.src='Pictures/right.jpg';
		rightResult++;
		missedCurrentRound--;
		var snd = new Audio('Sounds/right.mp3');
        snd.play();
	}
	else {
		element.src='Pictures/wrong.jpg';
		wrongResult++;
		var snd = new Audio('Sounds/wrong.mp3');
        snd.play();
	}
	element.onclick = null;
	element.ondblclick = null;
	updateResults();
}

function updateResults() {
	$('#rightResultText').html(rightResult);
	$('#wrongResultText').html(wrongResult);
	$('#roundInfoText').html(round+"/25");
}

function showResultBoard() {
	$(".TabOptions").remove();		// remove previous board
	$("#boardGame").remove();
	$(".TabButtons").remove();
	round--;

	//create new Table with results
	$(".container").append("<table id='TabResults'><tr><td colspan='2' id='resultTitle' class='textResult'>TWÓJ WYNIK</td></tr><tr id='rightResult'><th class='textResult'>DOBRZE</th><th class='tableNumbers'>"+rightResult+"</th></tr><tr id='missedResult'><th class='textResult'>OMINIĘTE</th><th class='tableNumbers'>"+missedResult+"</th></tr><tr id='wrongResult'><th class='textResult'>ŹLE</th><th class='tableNumbers'>"+wrongResult+"</th></tr><tr id='timeResult'><th class='textResult'>CZAS W SEKUNDACH</th><th class='tableNumbers'>"+sec+"</th></tr><tr id='roundResult'><th class='textResult'>ILOŚĆ RUND</th><th class='tableNumbers'>"+round+"</th></tr><tr><td colspan='2'><button id='restart2' class='colorButton' onclick='restart()'>OD NOWA</button></td></tr></table>");
	clearInterval(interval);
}

function restart() {
	location.reload();
}

$().ready(function () {
    $("#playButton").bind("click", function() {
        start();
    });
});

