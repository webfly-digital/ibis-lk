export class Popup {
    constructor(name) {
        this.openedClass = 'opened'
        this.noscrollClass = 'data-noscroll'
        this.overlayClass = 'data-not-overlay'

        this.name = name
        this.target = name.getAttribute('data-popup')

        this.opener = document.querySelector(`[data-opener="${this.target}"]`)
        this.toggler = document.querySelector(`[data-toggler="${this.target}"]`)
        this.popup = document.querySelector(`[data-popup="${this.target}"]`)
        this.closers = document.querySelectorAll(`[data-closer="${this.target}"]`)
        this.overlay = document.querySelector('.overlay')

        this.initControllers()
    }

    togglePopup(event) {
        this.popup.classList.toggle(this.openedClass)

        if (this.popup.hasAttribute(this.noscrollClass)) {
            this.toggleNoscrollBody(true)
        }

        if (!this.popup.hasAttribute(this.overlayClass)) {
            this.overlay.classList.toggle(this.openedClass)
        }

        this.updateControllers()
    }

    openPopup(event) {
        this.popup.classList.add(this.openedClass)

        if (this.popup.hasAttribute(this.noscrollClass)) {
            this.toggleNoscrollBody(true)
        }

        if (!this.popup.hasAttribute(this.overlayClass)) {
            this.overlay.classList.add(this.openedClass)
        }

        this.updateControllers()
    }

    closePopup(event) {
        this.popup.classList.remove(this.openedClass)
        console.log(1)
        if (document.body.classList.contains('noscroll')) {
            this.toggleNoscrollBody()
        }

        if (this.overlay.classList.contains(this.openedClass)) {
            this.overlay.classList.remove(this.openedClass)
        }

        this.updateControllers()
    }

    toggleNoscrollBody() {
        if (document.body.classList.contains('noscroll')) {
            document.body.classList.remove('noscroll')
        } else {
            document.body.classList.add('noscroll')
        }
    }

    // чек контроллеров
    updateControllers() {
        if (this.popup.classList.contains(this.openedClass)) {
            if (this.opener) {
                this.opener.classList.add(this.openedClass)
            } else if (this.toggler) {
                this.toggler.classList.add(this.openedClass)
            }
        } else {
            if (this.opener) {
                this.opener.classList.remove(this.openedClass)
            } else if (this.toggler) {
                this.toggler.classList.remove(this.openedClass)
            }
        }
    }

    // инициализация контроллеров
    initControllers() {
        if (this.opener) {
            this.opener.addEventListener('click', (e) => {
                e.stopPropagation()
                this.openPopup()

                document.addEventListener('click', (event) => {
                    event.stopImmediatePropagation()
                    let clickInside = event.composedPath().includes(this.popup)

                    if (!clickInside) {
                        this.closePopup(event)
                    }
                })
            })
        }

        if (this.toggler) {
            this.toggler.addEventListener('click', (e) => {
                e.stopPropagation()
                this.togglePopup()
            })
        }

        if (this.closers.length) {
            this.closers.forEach(x => x.addEventListener('click', (e) => {
                e.stopPropagation()
                e.preventDefault()
                this.closePopup()
            }))
        }
    }

    // глобальные бинды
    // пример: openPopup_xx()
    bindGlobalControls() {
        window[`closePopup_${this.target}`] = this.closePopup.bind(this)
        window[`openPopup_${this.target}`] = this.openPopup.bind(this)
    }
}