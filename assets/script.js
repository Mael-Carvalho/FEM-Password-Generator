// entropyzer from https://github.com/jreesuk/entropizer/tree/master
(function() {
	'use strict';

	var defaultClasses = ['lowercase', 'uppercase', 'numeric', 'symbols'],
        symbolsCommon = "!@#$%^&*()_-+={}[]|:;'<>.?/";

	// Constructor
	function Entropizer(options) {
		var classes = (options && options.classes) || defaultClasses;
		this.classes = [];
		for (var i = 0; i < classes.length; i++) {
			this.classes.push(typeof classes[i] === 'string' ? Entropizer.classes[classes[i]] : classes[i]);
		}
	}

	// Preset character classes
	Entropizer.classes = {
		lowercase: { regex: /[a-z]/, size: 26 },
		uppercase: { regex: /[A-Z]/, size: 26 },
		numeric: { regex: /[0-9]/, size: 10 },
		symbols: { characters: symbolsCommon}
	};

	// Find the contribution of a character class to a password's alphabet
	Entropizer.prototype._evaluateClass = function(charClass, password) {
		var chars, i;
		if (charClass.regex && charClass.regex.test(password)) {
			return charClass.size;
		}
		else if (charClass.characters) {
			chars = charClass.characters;
			for (i = 0; i < chars.length; i++) {
				if (password.indexOf(chars.charAt(i)) > -1) {
					return chars.length;
				}
			}
		}
		return 0;
	};

	// Calculate the number of bits of entropy in a password
	Entropizer.prototype.evaluate = function(password) {
		var i, alphabetSize = 0;

		if (!password) {
			return 0;
		}

		// Find the alphabet of the password (the union of all the classes it uses)
		for (i = 0; i < this.classes.length; i++) {
			alphabetSize += this._evaluateClass(this.classes[i], password);
		}

		// If it's all unknown characters, return 0 instead of -Infinity
		if (alphabetSize === 0) {
			return 0;
		}

		return Math.log(alphabetSize) / Math.log(2) * password.length;
	};

	// AMD module
	if (typeof define === 'function' && define.amd) {
		define([], function() {
			return Entropizer;
		});
	}
	// CommonJS module
	else if (typeof module === 'object' && typeof module.exports === 'object') {
		module.exports = Entropizer;
	}
	// Define global if no module framework
	else if (typeof window === 'object') {
		window.Entropizer = Entropizer;
	}

})();



/* let entropizer = new Entropizer();
let entropy = entropizer.evaluate('passzzzzzzzzzzzzzzzzzzword123');
console.log(entropy); */


function password(lenght, checkboxs) {
    

    let lower = "abcdefghijklmnopqrstuvwxyz";
    let upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let numbers = "0123456789";
    let symbols = "!@#$%^&*()_-+={}[]|:;'<>.?/";

    let alphabet = "";

    for (let i = 0; i < checkboxs.length; i++) {
        if (checkboxs[i].checked) {
            if (i === 0) {
                alphabet += upper;
            } else if (i === 1) {
                alphabet += lower;
            }else if (i === 2) {
                alphabet += numbers;
            }else if (i === 3) {
                alphabet += symbols;
            }


        }
    }
    //console.log(alphabet);

    if (alphabet.length < 10) {
        return "";
    }

    let password = "";


    for (let i = 0; i < lenght; i++) {
        let pos = Math.round(Math.random() * (alphabet.length + 1));
        password += alphabet.substring(pos, pos + 1);
        
    }

    return password;

    
}


let checkbox = document.querySelectorAll(".passcheck");

let go = document.querySelector("button");

let textpass = document.querySelector("#password");

let range = document.querySelector("#range");



// Longeur du mdp
range.addEventListener('input', () => {
    document.querySelector("#passl").innerHTML = range.value;
});


// Gen mdp + entropie
go.addEventListener('click', () => {
    let entropizer = new Entropizer();
    let password_generate = '';
    let passlen = document.querySelector("#range").value;
    textpass.value = password_generate =  password(passlen,checkbox);
    
    let entropy = Math.round(entropizer.evaluate(password_generate));
    console.log(entropy);
    setEntropy(entropy);

});
// < 60 => mauvais
// < 80 => moyen
// > 80 => bon
// > 100 => excellent


// Show entropy to user
function setEntropy(entropy) {
    //Texte
    let strength = document.querySelector("#intensity_strength");

    
    if (entropy < 60) {
        strength.innerHTML = "Low";
        setColor(1);
    } else if (entropy > 60 && entropy < 80){
        strength.innerHTML = "Medium";
        setColor(2);
    } else if (entropy > 80 && entropy < 100){
        strength.innerHTML = "High";
        setColor(3);
    } else if (entropy > 100){
        strength.innerHTML = "Excellent";
        setColor(4);
    }

    
    
}

function setColor(num) {
    // Indicateur de couleur
    let tab_couleur = document.querySelectorAll(".intensity_level");
    if (num === 1) {
        tab_couleur[0].style.backgroundColor = "red";
        tab_couleur[1].style.backgroundColor = "transparent";
        tab_couleur[2].style.backgroundColor = "transparent";
        tab_couleur[3].style.backgroundColor = "transparent";
    } else if (num === 2){
        tab_couleur[0].style.backgroundColor = "orange";
        tab_couleur[1].style.backgroundColor = "orange";
        tab_couleur[2].style.backgroundColor = "transparent";
        tab_couleur[3].style.backgroundColor = "transparent";
    } else if (num === 3){
        tab_couleur[0].style.backgroundColor = "yellow";
        tab_couleur[1].style.backgroundColor = "yellow";
        tab_couleur[2].style.backgroundColor = "yellow";
        tab_couleur[3].style.backgroundColor = "transparent";

    } else if (num === 4){
        tab_couleur[0].style.backgroundColor = "green";
        tab_couleur[1].style.backgroundColor = "green";
        tab_couleur[2].style.backgroundColor = "green";
        tab_couleur[3].style.backgroundColor = "green";
    }
}

// copy to clipboard
let copy = document.querySelector(".copy");

copy.addEventListener('click', () => {
    
    let targettext = document.querySelector("#password").value;
    navigator.clipboard.writeText(targettext);
    alert("Copied.");
});