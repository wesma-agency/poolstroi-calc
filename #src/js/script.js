document.addEventListener("DOMContentLoaded", function () {
	let sliderMainScreen = new Swiper(".tape-calc__slider", {
		slidesPerView: 1,
		spaceBetween: 20,
		watchOverflow: true,
		navigation: {
			nextEl: ".tape-calc__slider .slider-arrow-next",
			prevEl: ".tape-calc__slider .slider-arrow-prev",
		},

		breakpoints: {
			590: {
				slidesPerView: 2,
			},

			767: {
				slidesPerView: 3,
			},

			1190: {
				slidesPerView: 4,
			},
		},
	});

	let sliderAdditionalItem = new Swiper(".popup-additional__slider", {
		slidesPerView: "auto",
		watchOverflow: true,
	});

	let arrGallery = document.querySelectorAll(".lightgallery");

	if (arrGallery.length > 0) {
		arrGallery.forEach((element) => {
			lightGallery(element, {
				plugins: [lgVideo],
				selector: ".lightgallery-item",
				speed: 500,
				zoomFromOrigin: false,
				mobileSettings: {
					controls: true,
				},
			});
		});
	}

	// phonemask
	let inputTel = document.querySelectorAll("input[type='tel']");

	if (inputTel.length > 0) {
		inputTel.forEach((element) => {
			IMask(element, {
				mask: "+{7} 000 000-00-00",
			});
		});
	}

	let allSelecet = document.querySelectorAll("select");

	if (allSelecet.length > 0) {
		allSelecet.forEach((element) => {
			NiceSelect.bind(element);
		});
	}

	let inputSide = Array.prototype.slice.call(document.querySelectorAll(".js-side-input"));
	let dotSide = Array.prototype.slice.call(document.querySelectorAll(".js-side-dot"));
	let lineSide = Array.prototype.slice.call(document.querySelectorAll(".js-line-side"));

	let radioZone = document.querySelectorAll(".js-zone");
	let elSmallZone = document.querySelectorAll(".small-zone");
	let elStandartZone = document.querySelectorAll(".standart-zone");

	function changeZone(input) {
		let idZone = input.getAttribute("data-zone");
		if (idZone === "small") {
			elSmallZone.forEach((el) => {
				el.classList.add("show");
			});

			elStandartZone.forEach((el) => {
				el.classList.remove("show");
			});

			inputSide.forEach((element) => {
				let dataInputZone = element.getAttribute("data-side");

				if (dataInputZone == "width-small" || dataInputZone == "depth-small") {
					element.classList.remove("disabled");
					element.querySelector("input").disabled = false;
				}
			});
		}

		if (idZone === "standart") {
			elSmallZone.forEach((el) => {
				el.classList.remove("show");
			});

			elStandartZone.forEach((el) => {
				el.classList.add("show");
			});

			inputSide.forEach((element) => {
				let dataInputZone = element.getAttribute("data-side");

				if (dataInputZone == "width-small" || dataInputZone == "depth-small") {
					element.classList.add("disabled");
					element.querySelector("input").disabled = true;
				}
			});
		}
	}

	if (radioZone.length > 0 && elSmallZone.length > 0 && elStandartZone.length > 0) {
		radioZone.forEach((element) => {
			if (element.checked === true) {
				changeZone(element);
			}
		});
	}

	radioZone.forEach((element) => {
		element.addEventListener("change", function () {
			changeZone(this);
		});
	});

	// Позиция надписей
	function hintPosition() {
		if (dotSide.length > 0) {
			dotSide.forEach((element) => {
				let textDot = element.querySelector(".size-calc__dot-name");
				let leftWidth = textDot.offsetLeft + textDot.getBoundingClientRect().left;
				let rightWidth = window.innerWidth - textDot.getBoundingClientRect().right;
				if (leftWidth < 10) {
					element.classList.remove("--left");
				}

				if (rightWidth < 10) {
					element.classList.add("--left");
				}
			});
		}
	}

	hintPosition();

	window.addEventListener("resize", hintPosition);

	function clearSide() {
		lineSide.forEach((el) => el.classList.remove("--show"));
		dotSide.forEach((el) => el.classList.remove("--show"));
		inputSide.forEach((el) => el.classList.remove("--show"));
	}

	function findDataAttrSide(arr, attr, pramComparation) {
		return arr.find((item) => item.getAttribute(attr) === pramComparation);
	}

	function enterEl() {
		let dataSide = this.getAttribute("data-side");

		if (dataSide != null) {
			document.activeElement.blur();
			clearSide();
			findDataAttrSide(inputSide, "data-side", dataSide).querySelector("input").focus();
			findDataAttrSide(inputSide, "data-side", dataSide).classList.add("--show");
			findDataAttrSide(lineSide, "data-side", dataSide).classList.add("--show");
			this.classList.add("--show");
		}
	}

	function leaveEl() {
		let dataSide = this.getAttribute("data-side");
		if (!findDataAttrSide(inputSide, "data-side", dataSide).querySelector("input:focus")) {
			document.activeElement.blur();
			clearSide();
		}
	}

	function addHandlerWidth() {
		if (window.innerWidth > 1190) {
			dotSide.forEach((element) => {
				element.addEventListener("mouseenter", enterEl);
				element.addEventListener("mouseleave", leaveEl);

				element.removeEventListener("touchstart", enterEl);
			});
		} else {
			dotSide.forEach((element) => {
				element.removeEventListener("mouseenter", enterEl);
				element.removeEventListener("mouseleave", leaveEl);

				element.addEventListener("click", enterEl);
			});
		}
	}

	if (dotSide.length > 0 && inputSide.length > 0 && lineSide.length > 0) {
		window.addEventListener("resize", addHandlerWidth);
		addHandlerWidth();

		inputSide.forEach((element) => {
			element.querySelector(".input-ui__field").addEventListener("focus", function () {
				let dataSide = element.getAttribute("data-side");

				if (dataSide != null) {
					findDataAttrSide(dotSide, "data-side", dataSide).classList.add("--show");
					findDataAttrSide(lineSide, "data-side", dataSide).classList.add("--show");
					element.classList.add("--show");
				}
			});

			element.querySelector(".input-ui__field").addEventListener("blur", function () {
				clearSide();
			});
		});
	}
});

document.addEventListener("click", function (e) {
	let target = e.target;

	if (target.closest(".js-sort")) {
		let sortId = target.getAttribute("data-sort");
		let sortType = target.getAttribute("data-sort-type");
		let sortContainer = target.closest(".js-sort-container");

		let list = sortContainer.querySelector(".table-price__list");
		let items = sortContainer.querySelectorAll(".table-price__item");
		let itemsArr = [];

		for (i = 0; i < items.length; ++i) {
			itemsArr.push(items[i]);
		}

		if (sortType === "number") {
			if (target.classList.contains("desc") || false) {
				target.classList.add("asc");
				target.classList.remove("desc");
				itemsArr.sort(function (a, b) {
					let first = parseInt(a.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`).replace(/ /g, ""));
					let second = parseInt(b.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`).replace(/ /g, ""));
					return first == second ? 0 : first > second ? 1 : -1;
				});
			} else {
				target.classList.remove("asc");
				target.classList.add("desc");
				itemsArr.sort(function (a, b) {
					let first = parseInt(a.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`).replace(/ /g, ""));
					let second = parseInt(b.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`).replace(/ /g, ""));
					return first == second ? 0 : first < second ? 1 : -1;
				});
			}
		}

		if (sortType === "string") {
			if (target.classList.contains("asc") || false) {
				target.classList.remove("asc");
				target.classList.add("desc");
				itemsArr.sort(function (a, b) {
					let first = a.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`);
					let second = b.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`);
					return second.localeCompare(first);
				});
			} else {
				target.classList.add("asc");
				target.classList.remove("desc");
				itemsArr.sort(function (a, b) {
					let first = a.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`);
					let second = b.querySelector(`.js-sort-item[data-sort-value-${sortId}]`).getAttribute(`data-sort-value-${sortId}`);
					return first.localeCompare(second);
				});
			}
		}

		for (i = 0; i < itemsArr.length; ++i) {
			list.appendChild(itemsArr[i]);
		}
	}

	if (target.closest(".js-toggle")) {
		let idList = target.getAttribute("data-toggle");
		e.preventDefault();
		target.closest(".js-toggle").classList.toggle("show");
		document.querySelector(`[data-lsit-toggle=${idList}]`).classList.toggle("show");
	}

	if (target.closest(".js-show-popup-additional")) {
		let idList = target.getAttribute("data-value-popup");
		e.preventDefault();
		document.querySelector("body").classList.add("lock");
		document.querySelector(`[data-popup=${idList}]`).classList.add("show");
	}

	if (target.closest(".popup-additional__colose")) {
		target.closest(".popup-additional").classList.remove("show");
		document.querySelector("body").classList.remove("lock");
	}
});

document.addEventListener("DOMContentLoaded", function () {
	// Открытие попапов МОЖНО УДАЛЯТЬ
	let popupAllElem = Array.prototype.slice.call(document.querySelectorAll(".modal"));
	let openButton = Array.prototype.slice.call(document.querySelectorAll(".js-modal-show"));
	let closeButton = Array.prototype.slice.call(document.querySelectorAll(".js-modal-close"));
	let popupOverlay = document.querySelector(".popup-overlay");
	let body = document.querySelector("body");

	function openPopup(e) {
		e.preventDefault();
		let modal = document.querySelector(`#${e.target.dataset.popup}`);
		modal.classList.add("active");
		popupOverlay.classList.add("active");
		body.classList.add("lock");

		setTimeout(() => {
			modal.style.opacity = "1";
			popupOverlay.style.opacity = "1";
		}, 100);
	}

	function closePopup() {
		popupAllElem.forEach((element) => {
			if (element.classList.contains("active")) {
				let modal = element;

				setTimeout(() => {
					modal.classList.remove("active");
					popupOverlay.classList.remove("active");
				}, 300);
				modal.style.opacity = "0";
				popupOverlay.style.opacity = "0";
				body.classList.remove("lock");
			}
		});
	}

	if (openButton != null) {
		openButton.forEach((element) => {
			element.addEventListener("click", (e) => {
				closePopup(e);

				openPopup(e);
			});
		});
	}

	if (closeButton != null) {
		closeButton.forEach((element) => {
			element.addEventListener("click", (e) => {
				closePopup();
			});
		});
	}

	if (popupAllElem != null) {
		popupAllElem.forEach((element) => {
			element.addEventListener("click", (e) => {
				if (e.target.parentNode.classList.contains("modal")) {
					closePopup();
				}
			});
		});
	}
});
