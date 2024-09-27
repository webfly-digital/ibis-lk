import { Popup } from './modules/_popups.js'
import easydropdown from 'easydropdown';
import GLightbox from 'glightbox';
import IMask from 'imask';
import Dropzone from "dropzone";

document.addEventListener('DOMContentLoaded', function () {
	initPopups()
	initDropdowns()
	const lightbox = GLightbox({});
	initIMask()
	initDropzone()
})

function initPopups() {
	let popups = document.querySelectorAll(`[data-popup]`)

	if (!popups) return

	popups.forEach(x => {
		let newPopup = new Popup(x).bindGlobalControls()
	})
}

const initDropdowns = () => {
	let selects = document.querySelectorAll('.ezdd')

	selects.length && selects.forEach(select => {
		const edd = easydropdown(select, {
			behavior: {
				useNativeUiOnMobile: false
			}
		});
	})
}

const initIMask = () => {
	let dateInputs = document.querySelectorAll('.date-input')

	dateInputs.length && dateInputs.forEach(input => {
		const mask = IMask(input, {
			mask: Date,

		});
	})
}

const initDropzone = () => {
	let dropzones = document.querySelectorAll('.dropzone'),
		uploadBtn = document.querySelector('.upload')

	dropzones.length && dropzones.forEach(dd => {
		var myDropzone = new Dropzone(dd, {
			url: "/",
			createImageThumbnails: true,
			addRemoveLinks: true,
			uploadMultiple: true,
			// maxFiles: 1,
			// maxThumbnailFilesize:
			thumbnailWidth: 217,
			thumbnailHeight: 290,
		});
	})

	if (uploadBtn) {
		uploadBtn.addEventListener('click', e => {
			e.stopPropagation()
			e.preventDefault()
			document.querySelector('.dz-button').click()
		})
	}
}