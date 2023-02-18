//Ham doi tuong - 
function Validator(options) {
    // console.log(options.form);

    var selectorRules = {};
    // Ham thuc hien validate

    function validate(inputElement, rule) {
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        // Lay ra cac rule cua selector
        var rules = selectorRules[rule.selector];
        // Lap qua tung rulw( & check)
        // Neu co loi thi dung vc check

        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }

        if (errorMessage) {
            // lay cha cua no
            errorElement.innerText = errorMessage;
            inputElement.parentElement.classList.add('invalid')
        }
        else {
            errorElement.innerText = "";
            inputElement.parentElement.classList.remove('invalid')

        }
        return !errorMessage;
    }
    // Lay element cua form can validate
    var formElement = document.querySelector(options.form);

    if (formElement) {

        formElement.onsubmit = function (e) {
            e.preventDefault();

            var isFromValid = true;

            // Thuc hien lap qua tung rule va validate
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {
                    isFromValid = false;
                }
            });

            // console.log(formValues)

            if (isFromValid) {
                // TH submit vs javascript
                if (typeof options.onSubmit === 'function') {
                    // var enableInputs = formElement.querySelectorAll('[name]:not([disabled])');
                    //  Chon tat ca cac the co ten filed la name , ko co flied la diable 

                    var enableInputs = formElement.querySelectorAll('[name]');

                    var formValues = Array.from(enableInputs).reduce(function (values, input) {
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues)
                }
                else{
                    // TH submit = html mac dinh
                    formElement.submit();

                    console.log(" 0 co loi")
                }
            } else {
                console.log(" co loi")

            }
        }
        //Lap qua moi rule va xu ly(lang nghe su kien blur,input)
        options.rules.forEach(function (rule) {
            //Luu lai cac rule trong moi input
            if (Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test)
            } else {
                selectorRules[rule.selector] = [rule.test];
                // console.log(rule.test)
            }


            // var inputElement = formElement.querySelector(rule.selector);
            var inputElement = formElement.querySelector(rule.selector);
            // Xu ly trường hợp blur khỏi input
            if (inputElement) {
                inputElement.onblur = function () {

                    validate(inputElement, rule);

                }
                // Xu lu TH moi khi nguoi dung nhap vao input 
                inputElement.oninput = function () {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);

                    // errorElement.innerText = "Trường này phải là email";
                    errorElement.innerText = "";
                    inputElement.parentElement.classList.remove('invalid')
                }

            }
        });
    }
}

// Dinh nghia rule
// Nguyen tac cac rule:
/*
1.Khi co loi => tra ra msg loi
2.Khi hop le => ko tra ra cj ca (undefined)
*/
Validator.isRequired = function (selector, msg) {
    // return selector;
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : msg || 'Vui lòng nhập trường này'

        }
    }
}
Validator.isEmail = function (selector, msg) {
    return {
        selector: selector,
        test: function (value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined : msg || 'Trường này phải là email'
        }
    }
}
Validator.minLength = function (selector, min, msg) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min ? undefined : msg || 'Vui lòng nhập tối thiểu 6 kí tự'
        }
    }
}
Validator.isConfirmation = function (selector, getConfirmValue, msg) {
    return {
        selector: selector,
        test: function (value) {
            return value === getConfirmValue() ? undefined : msg || 'Giá trị nhập lại không chính xác'
        }
    }
}