
//	Liste de tous les neuronnes du système
var listOfNeurones = [];

//	Liste de toutes les sorties du système
var listOfExits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

//	Nombre de neurones du système
var numberOfNeurones = 30;

//	Taux d'apprentissage compris entre 0 et 1
var learningRate = 0.25;

//	Seuil d'activation d'un neurone
var threshold = 0.5;

//	Valeur d'un neurone lorsqu'il est actif
var activeInput = 1;

//	Valeur d'un neurone lorsqu'il est inactif
var disabledInput = 0;

//	Poid initial entre un neurone et une sortie
var initialWeight = 1;

//	Liste des chiffres
var listOfNumbers = [

	//	Chiffre 0
	[[], [6, 7, 8, 11, 13, 16, 18, 21, 22, 23]],

	//	Chiffre 1
	[[], [2, 6, 7, 12, 17, 21, 22, 23]],

	//	Chiffre 2
	[[], [1, 2, 3, 8, 11, 12, 13, 16, 21, 22, 23]],

	//	Chiffre 3
	[[], [1, 2, 3, 8, 12, 13, 18, 21, 22, 23]],

	//	Chiffre 4
	[[], [1, 6, 8, 11, 12, 13, 14, 18, 23]],

	//	Chiffre 5
	[[], [1, 2, 3, 6, 11, 12, 13, 18, 21, 22, 23]],

	//	Chiffre 6
	[[], [1, 2, 3, 6, 11, 12, 13, 16, 18, 21, 22, 23]],

	//	Chiffre 7
	[[], [1, 2, 3, 8, 12, 13, 14, 18, 23]],

	//	Chiffre 8
	[[], [1, 2, 3, 6, 8, 11, 12, 13, 16, 18, 21, 22, 23]],

	//	Chiffre 9
	[[], [1, 2, 3, 6, 8, 11, 12, 13, 18, 21, 22, 23]]
]

//	Un neurone
//	Paramètres : 
//		Valeur du neurone
//		Liste de poids (un poid par sortie)
function Neurone(input, weights) {
	this.input = input;
    this.weights = weights;
}

function ResizePerceptron(numberOfNeurones) {

	if ($(window).width() <= $(window).height()) {
		var widthPlateau = ($(window).width() / 2);
		var heightPlateau = widthPlateau + (widthPlateau / 5);
	}
	else {
		var widthPlateau = ($(window).height() / 2);
		var heightPlateau = widthPlateau + (widthPlateau / 5);
	}

	$("#grid").width(widthPlateau);
	$("#grid").height(heightPlateau);

	var paddingButton = ((($(window).height() - heightPlateau) / 2) - 21) / 16;

	$("input").css("padding", paddingButton + "px");
	$("button").css("padding", paddingButton + "px");

	$("#learn").css("margin-top", ($("#learnText").height() + 13 + (paddingButton * 2)) + "px");
	$("#find").css("margin-top", ($("#find").height() + 13 + (paddingButton * 2)) + "px");

	var marginTop = ($(window).height() - heightPlateau) / 2;
	var marginLeft = ($(window).width() - widthPlateau) / 2;

	$("#grid").css("margin-top", (marginTop + 25) + "px");
	$("#grid").css("margin-left", marginLeft + "px");

	var tailleNeurone = (widthPlateau / 5) - 2;

	$(".neurone").width(tailleNeurone);
	$(".neurone").height(tailleNeurone);
}

function CreatePerceptron(numberOfNeurones) {

	$("body").append("<div id='grid'></div>");

	for (var idOfNeurone = 0; idOfNeurone < numberOfNeurones; idOfNeurone++) {
		var listOfWeights = [];

		for (var idOfExit = 0; idOfExit < listOfExits.length; idOfExit++) {
			listOfWeights.push(initialWeight);
		}

		for (var idOfNumber = 0; idOfNumber < listOfExits.length; idOfNumber++) {
			if (listOfNumbers[idOfNumber][1].indexOf(idOfNeurone) != -1) {
				listOfNumbers[idOfNumber][0].push(new Neurone(activeInput, listOfWeights));
			}
			else {
				listOfNumbers[idOfNumber][0].push(new Neurone(disabledInput, listOfWeights));
			}
		}

		$("#grid").append("<div id='" + idOfNeurone + "' class='neurone'></div>");

		listOfNeurones.push(new Neurone(disabledInput, listOfWeights));
	}

	$("body").append("<div id='mainColumn'></div>");

	//	Learn
	$("#mainColumn").append("<input type='text' id='learnText' placeholder='number to learn' /><button id='learn'>Learn</button>");
	
	//	Find
	$("#mainColumn").append("<input type='text' id='findText' placeholder='number found after find' readonly /><button id='find'>Find</button>");

	//	Training
	$("#mainColumn").append("<button id='training'>Training</button>");

	//	Refresh
	$("#mainColumn").append("<button id='refresh'>Refresh</button>");

	//	Tutorial
	$("body").append("<a href='./tutorial.pdf' id='tutorial'>Tutorial</a>");
	

	ResizePerceptron(numberOfNeurones);
}

//	Permet de calculer la valeur obtenue pour une sortie
//	Paramètres : 
//		ID de la sortie
//		Liste des neurones (optionnel)
function CalculationOfObtainedValue(idOfExit, list) {
	var obtainedValue = 0;

	//	Valeur par défaut pour le paramètre List
    if (typeof(list) == 'undefined' ){
        list = listOfNeurones;
    }

    //	On boucle sur tous les neurones
	for (var idOfNeurone = 0; idOfNeurone < list.length; idOfNeurone++) {

		//	On vérifie que le neurone est activé
		if (list[idOfNeurone].input >= threshold) {
			obtainedValue = obtainedValue + (list[idOfNeurone].input * list[idOfNeurone].weights[idOfExit]);
		}
	}

	return obtainedValue;
}

//	Permet d'obtenir la liste des sorties reconnues
//	Paramètres : 
//		Liste des neurones (optionnel)
function Find(list) {

	var listOfExitFind = [];

	//	Valeur par défaut pour le paramètre List
    if (typeof(list) == 'undefined' ){
        list = listOfNeurones;
    }

    //	On boucle sur toutes les sorties et on calcul la valeur reçus
	for (var idOfExit = 0; idOfExit < listOfExits.length; idOfExit++) {
		if (CalculationOfObtainedValue(idOfExit, list) >= threshold) {
			listOfExitFind.push(idOfExit);
		}
	}

	return listOfExitFind;
}

//	Permet d'apprendre un chiffre en mettant à jour les poids des neurones
//	Paramètres : 
//		ID de la sortie à apprendre
//		Liste des neurones (optionnel)
function Learn(idOfExitToLearn, list) {

	var numberIsLearn = false;

	//	Valeur par défaut pour le paramètre List
    if (typeof(list) == 'undefined' ){
        list = listOfNeurones;
    }

    //	On boucle tant que le chiffre n'est pas appris
	while(numberIsLearn == false) {

	  	//	On boucle sur toutes les sorties
		for (var idOfExit = 0; idOfExit < listOfExits.length; idOfExit++) {

			//	On définit la valeur attendus
			if (idOfExit == idOfExitToLearn) {
				var expectedvalue = 2 * threshold;
			}
			else {
				var expectedvalue = disabledInput;
			}

			//	On boucle sur tous les neurones
			for (var idOfNeurone = 0; idOfNeurone < list.length; idOfNeurone++) {

				//	On définit la valeur obtenue
				var obtainedValue =  CalculationOfObtainedValue(idOfExit, list);

				//	On met à jour le poid 
				list[idOfNeurone].weights[idOfExit] = list[idOfNeurone].weights[idOfExit] + (expectedvalue - obtainedValue) * list[idOfNeurone].input * learningRate;
			}
		}

		//	On récupère la liste des chiffres reconnues
  		var listOfExitsFind = Find(list);

		//	On vérfie qu'après le find, le chiffre sortant est celui attendus
		if ((listOfExitsFind.length == 1 && listOfExitsFind[0] == idOfExitToLearn)) {
			numberIsLearn = true;
		}
	}
}

//	Permet d'afficher les chiffres reconnues
function DisplayNumbersFind(listOfExitsFind ,idOfDivToUpdate) {

	var isFirstToBeWritten = true;

	$("#" + idOfDivToUpdate).val("");

	for (var idOfExitFind = 0; idOfExitFind < listOfExitsFind.length; idOfExitFind++) {
		if (isFirstToBeWritten == true) {
			$("#" + idOfDivToUpdate).val(listOfExits[listOfExitsFind[idOfExitFind]]);

			isFirstToBeWritten = false;
		}
		else {
			 $("#" + idOfDivToUpdate).val($("#" + idOfDivToUpdate).val() + " ou " + listOfExits[listOfExitsFind[idOfExitFind]]);
		}
	}
}

$(document).ready(function() {
	CreatePerceptron(numberOfNeurones);

	//	Au clic sur une neurone
	//		Si il est inactif on le définit comme actif
	//		Si il est actif on le définit comme inactif
	$(".neurone").click(function() {
		var idOfNeurone = $(this).attr("id");

		if (listOfNeurones[idOfNeurone].input == disabledInput) {
			listOfNeurones[idOfNeurone].input = activeInput;

			$(this).addClass("active");
		}
		else {
			listOfNeurones[idOfNeurone].input = disabledInput;

			$(this).removeClass("active");
		}
	})

	//	Permet de faire passer tous les neurones à inactif
	$("#refresh").click(function() {
		$(".neurone").removeClass("active");

		for (var idOfNeurone = 0; idOfNeurone < listOfNeurones.length; idOfNeurone++) {
			listOfNeurones[idOfNeurone].input = disabledInput;
		}
 	})

	//	Permet de faire apprendre un chiffre au système
  	$("#learn").click(function() {

  		//	Définit l'ID de la sortie à apprendre
  		var idOfExitToLearn = $("#learnText").val();

  		//	On met à jour les poids des neurones
  		Learn(idOfExitToLearn);

  		//	On récupère la liste des chiffres reconnues
  		var listOfExitsFind = Find();

		//	On affiche le ou les chiffre(s) reconnues
		DisplayNumbersFind(listOfExitsFind, "findText");
 	})

  	//	Permet d'afficher le ou les chiffre(s) reconnues
	$("#find").click(function() {

  		//	On récupère la liste des chiffres reconnues
  		var listOfExitsFind = Find();

  		//	On affiche le ou les chiffre(s) reconnues
  		DisplayNumbersFind(listOfExitsFind, "findText");
	})

	//	Permet d'apprendre automatiquement les chiffres
	$("#training").click(function() {
		var numbersAreLearn = false;
		var numbersCompteur = 0;

		//	On boucle tant que tous les nombres ne sont pas appris
		while(numbersAreLearn == false) {

			var listOfTotalExitsFind = [];

			//	On boucle sur toutes les sorties
			for (var idOfExit = 0; idOfExit < listOfExits.length; idOfExit++) {

				var listOfNumbersFind = Find(listOfNumbers[idOfExit][0]);

				//	On ne fait apprendre le chiffre que si c'est nécessaire
				if (listOfNumbersFind.length != 1 || listOfNumbersFind[0] != idOfExit) {
					Learn(idOfExit, listOfNumbers[idOfExit][0]);

					numbersCompteur++;
				}	
			}

			//	On boucle sur toutes les sorties
			for (var idOfExit = 0; idOfExit < listOfExits.length; idOfExit++) {
				var listOfNumbersFind = Find(listOfNumbers[idOfExit][0]);

				//	On définit comme "appris" un chiffre si le chiffre sortant après le find est celui attendus
				if (listOfNumbersFind.length == 1 && listOfNumbersFind[0] == idOfExit) {
					listOfTotalExitsFind.push(true);
				}
			}

			//	On vérifie que tous les chiffres sont appris
			if (listOfTotalExitsFind.length == listOfExits.length) {
				numbersAreLearn = true;

				alert("End of traning in " + numbersCompteur + " learn to " + listOfExits.length + " numbers");
			}
		}
	})
})

$(window).resize(function() {
	ResizePerceptron(numberOfNeurones);
})