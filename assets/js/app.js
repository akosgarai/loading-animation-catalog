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
