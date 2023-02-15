// The configuration for the flipbook pages.
// each has a name, label, a template id.
var pageContent = [
	{ 'name': 'tesseract', 'label': 'Tesseract', 'template': 'tesseract' },
	{ 'name': 'infinite', 'label': 'Infinite', 'template': 'infinite' },
	{ 'name': 'ripples', 'label': 'Ripples', 'template': 'ripples' },
	{ 'name': 'clock', 'label': 'Clock', 'template': 'clock' },
	{ 'name': 'electrons', 'label': 'Electrons', 'template': 'electrons' },
];

// It creates the pages, adds the page numbers and also adds it to the table of contents.
function buildFlipbook() {
	pageContent.forEach((pageConfig, index) => {
		const paper = document.getElementById('paper-template').content.firstElementChild.cloneNode(true);
		const page = document.getElementById(pageConfig.template + '-template');
		// setup the first page. Only the page number has to be shown.
		const pageNumber = document.querySelectorAll('.book .paper').length ;
		paper.querySelector('.front .page-number span').textContent = pageNumber * 2 + 1;
		// setup the back page. The page number and the page label has to be shown.
		paper.querySelector('.back .page-number span').textContent = pageNumber * 2 + 2;
		// add the page label and the animation template to the back page.
		paper.querySelector('.back .page-content h3.title.paragraph').textContent = pageConfig.label;
		paper.querySelector('.back .page-content .loader-container').appendChild(page.content.firstElementChild.cloneNode(true));
		const book = document.querySelector('.book');
		book.appendChild(paper);
		// add the table of contents entry
		const tableOfContents = document.querySelector('.cover .book .paper .back .table-of-contents');
		const tableOfContentsEntry = document.getElementById('toc-item-template').content.firstElementChild.cloneNode(true);
		tableOfContentsEntry.querySelector('.chapter-name').textContent = (index + 1) + ' ' + pageConfig.label;
		tableOfContentsEntry.querySelector('.page-number').textContent = pageNumber * 2 + 2;
		tableOfContents.appendChild(tableOfContentsEntry);
	});
}

function flip(element) {
	// determine the direction of the flip
	let direction = element.classList.contains("last-flipped") ? "back" : "front";
	// If the element is already flipped, flip it back
	// The last flipped element has to contain the class "last-flipped"
	// The first not flipped element has to contain the class "first-not-flipped"
	if (direction == "back") {
		element.classList.remove("last-flipped");
		element.classList.remove("flip");
		const firstNotFlipped = document.querySelector(".first-not-flipped");
		if (firstNotFlipped) {
			firstNotFlipped.classList.remove("first-not-flipped");
		}
		element.classList.add("first-not-flipped");
		// add the last-flipped class to the last element with the flip class
		let lastFlipped = document.querySelectorAll(".flip");
		lastFlipped = lastFlipped[lastFlipped.length - 1];
		if (lastFlipped) {
			lastFlipped.classList.add("last-flipped");
		}
	} else {
		// If the element is not flipped, flip it
		element.classList.remove("first-not-flipped");
		element.classList.add("flip");
		const lastFlipped = document.querySelector(".last-flipped");
		if (lastFlipped) {
			lastFlipped.classList.remove("last-flipped");
		}
		element.classList.add("last-flipped");
		// Add the first-not-flipped class to the first element with class page but not flip.
		const firstNotFlipped = document.querySelector(".paper:not(.flip)");
		if (firstNotFlipped) {
			firstNotFlipped.classList.add("first-not-flipped");
		}
	}
}

// Onload function. It builds the flipbook.
window.onload = function() {
	buildFlipbook();
};
