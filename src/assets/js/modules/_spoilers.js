function spoilers() {
    let spoilers = document.querySelectorAll('[data-spoiler]')

    if (!spoilers) return

    spoilers.forEach(spoiler => {
        let content = spoiler.nextElementSibling

        spoiler.addEventListener('click', () => {
            spoiler.classList.toggle('opened')
            content.classList.toggle('opened')

            if (content.style.maxHeight) {
				content.style.maxHeight = null;
			} else content.style.maxHeight = content.scrollHeight + "px";
        })
    })
}

export default spoilers;