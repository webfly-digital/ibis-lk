import { Popup } from './modules/_popups.js'
import easydropdown from 'easydropdown';
import GLightbox from 'glightbox';
import IMask from 'imask';
import Dropzone from "dropzone";

document.addEventListener('DOMContentLoaded', function () {
	initPopups()
	initDropdowns()
	initLightbox()
	initIMask()
	initDropzone()
	initAvatar()
})

let lightbox

const initLightbox = () => {
	lightbox = GLightbox({});

	// lightbox.on('slide_removed', () => {
	// 	console.log('slide removed')
	// })
}

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
		uploadBtn = document.querySelector('.upload'),
		loadedFilesInput = document.querySelector('[name*=UF_PROGRESS_FILE]'),
		glightboxes = document.querySelectorAll('.profile-docs-list .glightbox')

	let dt = new DataTransfer()

	const initDelete = () => {
		glightboxes = document.querySelectorAll('.profile-docs-list .glightbox')

		glightboxes.length && glightboxes.forEach(glight => {
			if (!glight.classList.contains('inited')) {
				let index;
				if (glight.hasAttribute('data-index')) index = glight.getAttribute('data-index')

				glight.addEventListener('click', e => {
					e.preventDefault()
					e.stopPropagation()
					lightbox.openAt(index)
				})

				glight.querySelector('i.delete').addEventListener('click', e => {
					e.preventDefault()
					e.stopPropagation()

					if (index > 0) {
						glight.insertAdjacentHTML('afterend', `
							<input name="UF_PROGRESS_FILE_del[${index}]" hidden="" value="Y">
						`)
					}

					lightbox.removeSlide(index)
					glight.remove()
				})
			}
			glight.classList.add('inited')
		})
	}

	initDelete()

	dropzones.length && dropzones.forEach(dd => {
		var myDropzone = new Dropzone(dd, {
			url: "/",
			createImageThumbnails: true,
			addRemoveLinks: true,
			uploadMultiple: true,
			thumbnailWidth: 217,
			thumbnailHeight: 290,
			addedfile: file => {


				let newdt = new DataTransfer()
				newdt.items.add(file)
				let newdt_list = newdt.files

				var reader = new FileReader();
				reader.onloadend = function (e) {
					let allGs = document.querySelectorAll('.profile-docs-list .glightbox')
					let index = 0;
					let newInputs = document.querySelectorAll('input[data-new]');
					if (newInputs) index = newInputs.length
					console.log(newInputs)

					document.querySelector('.profile-docs-list').insertAdjacentHTML(`beforeend`, `
						<a href="${e.target.result}" class="glightbox" data-index="${allGs.length}">
							<input name="UF_PROGRESS_FILE[n${index}]" type="file" hidden="" multiple="" data-new="">
							<figure>
								<img src="${e.target.result}" alt="image">
								<i class="delete"></i>
								<i class="open"></i>
							</figure>
						</a>
					`)

					document.querySelector(`[name*="UF_PROGRESS_FILE[n${index}]"]`).files = newdt_list

					lightbox.insertSlide({
						href: `${e.target.result}`,
						type: 'image'
					});
					initDelete()
				};

				reader.readAsDataURL(file);
			}
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

const initAvatar = () => {
	let avatarInput = document.querySelector('[name=PERSONAL_PHOTO]'),
		delInput = document.querySelector('[name=PERSONAL_PHOTO_del]'),
		dropArea = document.querySelector('.profile-portfolio-head figure'),
		image = document.querySelector('.profile-portfolio-head figure img')

	function getBase64(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.readAsDataURL(file)
			reader.onload = () => resolve(reader.result)
			reader.onerror = error => reject(error)
		})
	}

	avatarInput && avatarInput.addEventListener('change', e => {
		if (delInput.checked) {
			delInput.checked = false
		}

		getBase64(avatarInput.files[0])
			.then(res => {
				image.classList.remove('hidden')
				image.setAttribute('src', `${res}`)
			})
	})

	delInput && delInput.addEventListener('change', e => {
		avatarInput.value = ''

		if (delInput.checked) {
			image.classList.add('hidden')
			image.setAttribute('src', '')
		}
	})
}