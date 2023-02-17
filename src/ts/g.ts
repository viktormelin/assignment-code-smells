/*
  1. Se om du kan hitta två stycken code smells i följande funktion och rätta till dem.
  Funktionen tar emot en lista med längshoppslängder och syftet med funktionen är att summera
  dessa hopplängder.
  */

function getLength(jumpings: number[]): number {
	return jumpings.reduce((jumpDistanceSoFar, currentJump) => jumpDistanceSoFar + currentJump);
}

/*
  2. I detta exempel har vi fokuserat på if-statements. Se om du kan göra exemplet bättre!
  */

class Student {
	constructor(public name: string, public handedInOnTime: boolean, public passed: boolean) {}
}

function getStudentStatus(student: Student): string {
	if (student.name === 'Sebastian' && student.handedInOnTime) {
		return 'VG';
	}

	return 'IG';
}

/*
  3. Variabelnamn är viktiga. Kika igenom följande kod och gör om och rätt.
  Det finns flera code smells att identifiera här. Vissa är lurigare än andra.
  */

class Temp {
	constructor(public city: string, public when: Date, public temp: number) {}
}

function averageWeeklyTemperature(readings: Temp[]) {
	const WEEK_IN_MS = 604800000;
	const DAYS_IN_WEEK = 7;

	const today = Date.now();

	let averageTemp = 0;

	for (const reading of readings) {
		if (reading.city === 'Stockholm') {
			if (reading.when.getTime() > today - WEEK_IN_MS) {
				averageTemp += reading.temp;
			}
		}
	}

	return averageTemp / DAYS_IN_WEEK;
}

/*
  4. Följande funktion kommer att presentera ett objekt i dom:en. 
  Se om du kan göra det bättre. Inte bara presentationen räknas, även strukturer.
  */

interface Product {
	name: string;
	price: number;
	amount: number;
	description: string;
	image: string;
	parent: HTMLElement;
}

function createHTMLElement({ type, text, parent }: { type: string; text?: string; parent: HTMLElement }) {
	const createdElement = document.createElement(type);

	if (text && parent) {
		createdElement.innerHTML = text;
		parent.appendChild(createdElement);
	}

	return createdElement;
}

function createHTMLImage({ src, alt, parent }: { src: string; alt?: string; parent: HTMLElement }) {
	const createdElement = document.createElement('img');

	createdElement.src = src;
	createdElement.alt = alt ? alt : '';

	parent.appendChild(createdElement);

	return createdElement;
}

function createCheckboxElement(parent: HTMLElement) {
	const createdElement = document.createElement('input');
	createdElement.type = 'checkbox';

	parent.appendChild(createdElement);

	return createdElement;
}

function showProduct(product: Product) {
	const container = createHTMLElement({ type: 'div', parent: product.parent });
	createHTMLElement({ type: 'h4', text: product.name, parent: container });
	createHTMLElement({ type: 'strong', text: product.price.toString(), parent: container });
	createHTMLImage({ src: product.image, parent: container });
}

/*
  5. Följande funktion kommer presentera studenter. Men det finns ett antal saker som 
  går att göra betydligt bättre. Gör om så många som du kan hitta!
  */
function presentStudents(students: Student[]) {
	const listOfStudents = document.querySelector('#passedstudents') as HTMLElement;

	for (const student of students) {
		const container = createHTMLElement({ type: 'div', parent: listOfStudents });
		const checkbox = createCheckboxElement(container);

		if (student.handedInOnTime) {
			checkbox.checked = true;
		}
	}
}

/*
  6. Skriv en funktion som skall slå ihop följande texter på ett bra sätt:
  Lorem, ipsum, dolor, sit, amet
  Exemplet under löser problemet, men inte speciellt bra. Hur kan man göra istället?
  */
function concatenateStrings() {
	const words = ['Lorem', 'ipsum', 'dolor', 'sit', 'amet'];
	return words.join(' ');
}

/* 
7. Denna funktion skall kontrollera att en användare är över 20 år och göra någonting.
    Det finns dock problem med denna typ av funktion. Vad händer när kraven ändras och
    fler och fler parametrar behöver läggas till? T.ex. avatar eller adress. Hitta en bättre
    lösning som är hållbar och skalar bättre. 
*/

interface User {
	name: string;
	birthday: Date;
	email: string;
	password: string;
}

function createUser(user: User) {
	function calculateAge(dob: Date) {
		const ageDiff = Date.now() - dob.getTime();
		const ageDate = new Date(ageDiff);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}

	const userAge = calculateAge(user.birthday);

	if (userAge < 20) return 'Du är under 20 år';

	// Skapa användare
}
