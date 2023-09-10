// Get Elements from the DOM
const numbersButtonGroup = document.querySelectorAll(".numbers button"),
	operatorsButtonGroup = document.querySelectorAll(".operators button"),
	btnsToShow = document.querySelectorAll(".show"),
	mathBtns = document.querySelectorAll(".math-btn"),
	trigBtns = document.querySelectorAll(".trig"),
	modeBtns = document.querySelectorAll(".mode button"),
	answer = document.querySelector(".answer"),
	equalToBtn = document.querySelector("#equal"),
	answerBtn = document.querySelector("#ans"),
	deleteBtn = document.querySelector("#delete"),
	clearBtn = document.querySelector("#clear"),
	inverseBtn = document.querySelector("#inverse"),
	scientificBtnGroup = document.querySelector("#scientific"),
	openBtn = document.querySelector("#open");

// Checks if the scientific menu is open
let isOpen = false;

// Indicates current mode (degree or radians) selected
let mode = "deg";

// Checks if inverse button is active or has been clicked
let isInverse = false;

// save the answer of a calculation
let savedAnswer;

// This changes the mode from degree to radians and vice versa
// It also adds an active class to the button to show the user it has changed
const changeModeAndToggleClass = (btn) => {
	// the button getting clicked
	btn.classList.add("active-mode");
	mode = btn.id;

	// Compare the button getting clicked to all the buttons in the original array and remove the active class if id does not match
	modeBtns.forEach((button) => {
		if (btn.id !== button.id) {
			button.classList.remove("active-mode");
		}
	});
};

// Change button color for a short time then revert it to its original color
const blinkColor = (e, color) => {
	let button = e.target;
	button.classList.add(color);
	setTimeout(() => button.classList.remove(color), 200);
};

// Display numbers as you type
const showBtnsValue = (e) => {
	let btnValue = e.target.value;
	const input = document.querySelector("#input");

	input.value += btnValue;
};

// Determines what math function to use depending on wether the inverse button has been clicked or not
const selectMathFunction = (e) => {
	let btnValue = e.target.value;
	// if inverse is true, use arc trigonometry functions else use regular functions
	if (isInverse) {
		if (btnValue === "sin") {
			evaluateMaths(Math.asin);
		} else if (btnValue === "cos") {
			evaluateMaths(Math.acos);
		} else if (btnValue === "tan") {
			evaluateMaths(Math.atan);
		} else evaluateMaths(Math.sqrt);
	} else {
		if (btnValue === "sin") {
			console.log("sine");
			evaluateMaths(Math.sin);
		} else if (btnValue === "cos") {
			evaluateMaths(Math.cos);
		} else if (btnValue === "tan") {
			evaluateMaths(Math.tan);
		} else evaluateMaths(Math.sqrt);
	}
};

// Evaluate the selected math function and display the answer
const evaluateMaths = (mathFunction) => {
	const input = document.querySelector("#input");
	// console.log(mathFunction === Math.sqrt);
	let result;

	// if mode is rad then evaluate normally else if it is deg then check if the function is square root.
	if (mode === "rad") {
		result = Function(`return ${mathFunction(input.value)}`)();
	} else {
		if (mathFunction !== Math.sqrt) {
			// If the function is not square root then use this formula
			if (isInverse) {
				result = Function(
					`return ${(mathFunction(input.value) * 180) / Math.PI}`
				)();
			} else {
				result = Function(
					`return ${mathFunction((input.value * Math.PI) / 180)}`
				)();
			}
		} else {
			result = Function(`return ${mathFunction(input.value)}`)();
		}
	}
	if (result || result === 0) {
		answer.innerHTML = result;
	} else {
		answer.innerHTML = "Math Error";
	}
	savedAnswer = answer.innerHTML;
};

// Evaluate the equation and display result
const evaluate = () => {
	const input = document.querySelector("#input");
	let result = Function(`return ${input.value}`)();
	console.log(result);
	if (result || result === 0) {
		answer.innerHTML = result;
	} else {
		answer.innerHTML = "";
	}
	savedAnswer = answer.innerHTML;
};

// Show the last answer saved in the variable on screen
const showSavedAnswer = () => {
	const input = document.querySelector("#input");
	if (!savedAnswer) {
		savedAnswer = "";
	}
	input.value += savedAnswer;
};

// Delete a single number at a time
const deleteSingleNumber = () => {
	const input = document.querySelector("#input");
	let inputString = input.value;

	let result;
	result = inputString.slice(0, -1);
	input.value = result;
};

// Clear the screen
const clearScreen = () => {
	const input = document.querySelector("#input");
	input.value = "";
	answer.innerHTML = "";
};

// Open scientific section modal
const openModal = () => {
	// Open the menu when button is clicked
	isOpen = !isOpen;
	scientificBtnGroup.classList.remove("fade-out");
	scientificBtnGroup.classList.add("fade-in");

	if (!isOpen) {
		// if isOpen === false
		scientificBtnGroup.classList.remove("fade-in");
		scientificBtnGroup.classList.add("fade-out");
	}
};

// Event Listeners

modeBtns.forEach((button) => {
	button.addEventListener("click", (e) => {
		let btn = e.target;
		changeModeAndToggleClass(btn);
	});
});

// Add blink effect to buttons
numbersButtonGroup.forEach((button) => {
	button.addEventListener("click", (e) => {
		blinkColor(e, "num-hover");
	});
});

operatorsButtonGroup.forEach((button) => {
	button.addEventListener("click", (e) => {
		blinkColor(e, "operator-hover");
	});
});

// Show button values on click
btnsToShow.forEach((button) => {
	button.addEventListener("click", (e) => {
		showBtnsValue(e);
	});
});

mathBtns.forEach((button) => {
	button.addEventListener("click", (e) => {
		selectMathFunction(e);
	});
});

// Change button text to indicate inverse has been clicked
const changeToArcTrig = (value) => {
	trigBtns.forEach((button) => {
		if (value) {
			button.innerHTML = `${button.value}<sup><small>-1</small></sup>`;
		} else {
			button.innerHTML = `${button.value}`;
		}
	});
};

inverseBtn.addEventListener("click", () => {
	isInverse = !isInverse;
	if (isInverse) {
		inverseBtn.classList.add("active-inverse");
	} else {
		inverseBtn.classList.remove("active-inverse");
	}
	changeToArcTrig(isInverse);
});

// Make calculator buttons respond when keyboard is pressed
window.addEventListener("keydown", (e) => {
	// To identify what key the user pressed
	let key = e.key;

	numbersButtonGroup.forEach((button) => {
		if (button.value === key) {
			button.click();
		}
	});

	operatorsButtonGroup.forEach((button) => {
		if (button.value === key) {
			button.click();
		}
	});

	if (key === "Backspace") {
		deleteBtn.click();
	} else if (key === "Delete") {
		clearBtn.click();
	} else if (key === "Enter") {
		equalToBtn.click();
	}
});

equalToBtn.addEventListener("click", evaluate);
answerBtn.addEventListener("click", showSavedAnswer);
deleteBtn.addEventListener("click", deleteSingleNumber);
clearBtn.addEventListener("click", clearScreen);
openBtn.addEventListener("click", openModal);

window.onload = clearScreen();