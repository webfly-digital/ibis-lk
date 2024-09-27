export class PhoneInput {
    constructor(input) {
        this.input = input
        this.initPhoneInputs()
    }

    getInputNumbersValue = function(input) {
        return input.value.replace(/\D/g, "");
    }

    onPhoneInput = function(e) {
        let input = e.target,
            inputNumbersValue = this.getInputNumbersValue(input),
            formattedInputValue = "",
            selectionStart = input.selectionStart;
            
        if (!inputNumbersValue) {
            return input.value = "";
        }

        if (input.value.length != selectionStart) {
            if (e.data && /\D/g.test(e.data)) {
                input.value = inputNumbersValue;
            }
            return;
        }

        // изменил с '7', '8', '9'
        if (['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].indexOf(inputNumbersValue[0]) > -1) {
            // Русский номер телефона
            
            // изменил с == '9'
            if (inputNumbersValue[0] != "7") inputNumbersValue = "7" + inputNumbersValue;
                let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
                formattedInputValue = firstSymbols + " ";
            if (inputNumbersValue.length > 1) {
                formattedInputValue += "(" + inputNumbersValue.substring(1, 4);
            }
            if (inputNumbersValue.length >= 5) {
                formattedInputValue += ") " + inputNumbersValue.substring(4, 7);
            }
            if (inputNumbersValue.length >= 8) {
                formattedInputValue += "-" + inputNumbersValue.substring(7, 9);
            }
            if (inputNumbersValue.length >= 10) {
                formattedInputValue += "-" + inputNumbersValue.substring(9, 11);
            }
            } else {
                // Не русский номер телефона
                formattedInputValue = "+" + inputNumbersValue.substring(0, 16);
            }
        input.value = formattedInputValue;
    }

    onPhoneKeyDown = function(e) {
        let input = e.target;
        if (e.keyCode == 8 && this.getInputNumbersValue(input).length == 1) {
            input.value = "";
        }
    }

    onPhonePaste = function(e) {
        let pasted = e.clipboardData || window.clipboardData,
            input = e.target,
            inputNumbersValue = this.getInputNumbersValue(input);

        if (pasted) {
        let pastedText = pasted.getData("Text");
        if (/\D/g.test(pastedText)) {
            input.value = inputNumbersValue;
        }
        }
    }

    initPhoneInputs() {
        this.input.addEventListener('input', this.onPhoneInput);
        this.input.addEventListener('keydown', this.onPhoneKeyDown);
        this.input.addEventListener('paste', this.onPhonePaste);
    }
}