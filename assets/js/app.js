// The configuration for the flipbook pages.
// each has a name, label, a template id.
var pageContent = [
	{
		'name': 'tesseract',
		'label': 'Tesseract',
		'template': 'tesseract',
		'settings': [
			{
				'variable': '--loader-tesseract-occ',
				'label': 'Outer cube color',
				'type': 'color',
			},
			{
				'variable': '--loader-tesseract-ocb',
				'label': 'Outer cube border',
				'type': 'color',
			},
			{
				'variable': '--loader-tesseract-icc',
				'label': 'Inner cube color',
				'type': 'color',
			},
			{
				'variable': '--loader-tesseract-ocw',
				'label': 'Outer cube width',
				'type': 'text',
			},
			{
				'variable': '--loader-tesseract-length',
				'label': 'Animation length',
				'type': 'text',
			},
			{
				'variable': '--loader-tesseract-oop',
				'label': 'Outer cube opacity',
				'type': 'text',
			},
			{
				'variable': '--loader-tesseract-iop',
				'label': 'Inner cube opacity',
				'type': 'text',
			},
		]
	},
	{
		'name': 'infinite',
		'label': 'Infinite',
		'template': 'infinite' ,
		'settings': [
			{
				'variable': '--loader-infinite-bg',
				'label': 'Background color',
				'type': 'color',
			},
			{
				'variable': '--loader-infinite-fg',
				'label': 'Foreground color',
				'type': 'color',
			},
			{
				'variable': '--loader-infinite-length',
				'label': 'Animation length',
				'type': 'text',
			},
		]
	},
	{
		'name': 'ripples',
		'label': 'Ripples',
		'template': 'ripples',
		'settings': [
			{
				'variable': '--loader-ripples-bc',
				'label': 'Border color',
				'type': 'color',
			},
		]
	},
	{
		'name': 'clock',
		'label': 'Clock',
		'template': 'clock',
		'settings': [
			{
				'variable': '--loader-clock-cbc',
				'label': 'Clock color',
				'type': 'color',
			},
			{
				'variable': '--loader-clock-pbc',
				'label': 'Pointer color',
				'type': 'color',
			},
		]
	},
	{
		'name': 'electrons',
		'label': 'Electrons',
		'template': 'electrons',
		'settings': [
			{
				'variable': '--loader-electron-one',
				'label': 'Electron one',
				'type': 'color',
			},
			{
				'variable': '--loader-electron-two',
				'label': 'Electron two',
				'type': 'color',
			},
		]
	},
];

// It creates the pages, adds the page numbers and also adds it to the table of contents.
function buildFlipbook() {
	const book = document.querySelector('.book');
	const tableOfContents = document.querySelector('.cover .book .paper .back .table-of-contents');

	pageContent.forEach((pageConfig, index) => {
		const paper = document.getElementById('paper-template').content.firstElementChild.cloneNode(true);
		const page = document.getElementById(pageConfig.template + '-template');
		// setup the first page. Only the page number has to be shown.
		const pageNumber = document.querySelectorAll('.book .paper').length ;
		paper.querySelector('.front .page-number span').textContent = pageNumber * 2 + 1;
		paper.querySelector('.front .page-number div').setAttribute('onclick', "flip(" + pageNumber + ")");
		// setup the back page. The page number and the page label has to be shown.
		paper.querySelector('.back .page-number span').textContent = pageNumber * 2 + 2;
		paper.querySelector('.back .page-number div').setAttribute('onclick', "flip(" + pageNumber + ")");
		// add the page label and the animation template to the back page.
		paper.querySelector('.back .page-content h3.title.paragraph').textContent = pageConfig.label;
		paper.querySelector('.back .page-content .loader-container').appendChild(page.content.firstElementChild.cloneNode(true));
		book.appendChild(paper);
		// add the table of contents entry
		const tableOfContentsEntry = document.getElementById('toc-item-template').content.firstElementChild.cloneNode(true);
		tableOfContentsEntry.querySelector('.chapter-name').textContent = (index + 1) + ' ' + pageConfig.label;
		tableOfContentsEntry.querySelector('.page-number').textContent = pageNumber * 2 + 2;
		tableOfContents.appendChild(tableOfContentsEntry);
	});
	// Add one more page to the flipbook. This page is the last page of the flipbook.
	// the page number only has to be set on the front page.
	const paper = document.getElementById('paper-template').content.firstElementChild.cloneNode(true);
	const pageNumber = document.querySelectorAll('.book .paper').length ;
	paper.querySelector('.front .page-number span').textContent = pageNumber * 2 + 1;
	paper.querySelector('.front .page-number div').setAttribute('onclick', "flip(" + pageNumber + ")");
	paper.querySelector('.back .page-number div').setAttribute('onclick', "flip(" + pageNumber + ")");
	book.appendChild(paper);
	// now the pages are set, so we loop through the pageContent array again
	// and add the setting form to the front page when it is available.
	const papers = document.querySelectorAll('.book .paper');
	pageContent.forEach((pageConfig, index) => {
		// extract the html from the template and display it as string in the html tab.
		const page = document.getElementById(pageConfig.template + '-template');
		const paper = papers[index+2];
		const pre = document.createElement('pre');
		let htmlText = page.content.firstElementChild.cloneNode(true).outerHTML;
		const lines = htmlText.split('\n');
		const numberOfTabsInTheLastLine = lines[lines.length - 1].split('\t').length - 1;
		// remove numberOfTabsInTheLastLine tabs from the beginning of each line that starts with a tab.
		htmlText = lines.map(line => {
			// if the line starts with numberOfTabsInTheLastLine tabs, remove them.
			if (line.startsWith('\t'.repeat(numberOfTabsInTheLastLine))) {
				return line.substring(numberOfTabsInTheLastLine);
			}
			return line;
		}).join('\n');
		pre.textContent = htmlText;
		paper.querySelector('.front .page-content .tab-contents .html').innerHTML = '';
		paper.querySelector('.front .page-content .tab-contents .html').appendChild(pre);
		if (typeof pageConfig.settings == 'undefined') {
			return;
		}
		paper.querySelector('.hidden').classList.remove('hidden');
		pageConfig.settings.forEach((setting) => {
			const settingsItemTemplate = document.getElementById('settings-item-template').content.firstElementChild.cloneNode(true);
			settingsItemTemplate.querySelector('.label').textContent = setting.label;
			settingsItemTemplate.querySelector('input').setAttribute('type', setting.type);
			settingsItemTemplate.querySelector('input').setAttribute('data-variable', setting.variable);
			const settingVariableValue = getComputedStyle(paper).getPropertyValue(setting.variable);
			settingsItemTemplate.querySelector('input').setAttribute('value', settingVariableValue.trim());
			paper.querySelector('.front .page-content .settings').appendChild(settingsItemTemplate);
		});
	});
}

function flip(elementIndex) {
	const element = document.querySelectorAll('.book .paper')[elementIndex];
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

// Tab navigation. The element is the tab element, the screen name is the name of the screen to show.
// First remove the active-tab class from all tabs and hide all screens.
// Then add the active-tab class to the clicked tab and show the screen with the screen name.
function showPageContent(element, screenName) {
	element.parentElement.querySelectorAll('div').forEach((child) => {
		child.classList.remove('active-tab');
	});
	element.classList.add('active-tab');
	const pageNode = element.parentElement.parentElement.parentElement;
	pageNode.querySelectorAll('.tab-contents > div').forEach((screen) => {
		screen.classList.add('hidden');
	});
	pageNode.querySelector('.tab-contents div.' + screenName).classList.remove('hidden');
}

// Onload function. It builds the flipbook.
window.onload = function() {
	buildFlipbook();
};
