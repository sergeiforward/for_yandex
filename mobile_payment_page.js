$(document).ready(function(){

    var app = function(){

        // Инициализация
        this.init = function(){

            this.detectBrowser();
            this.panMasking();
            this.globalInterval();
            this.initPageMode();
            this.observeAmount();
            this.dateFocusPlaceholder();
            this.changePlaceholder();
            this.startValidation();
            this.clearInputs();
            this.extendedMask();

        };

        // Инициализируем привязку/оплату
        this.initPageMode = function(){

            var values = {
                    paying: {
                            title: 'SuperJob | Оплата контактов',
                            buttonText: 'Подтвердить оплату'
                        },
                    linking: {
                        title: 'SuperJob | Привязка карты',
                        buttonText: 'Привязать карту'
                        }
                    },
                amount = parseInt($('#amount').text()),
                $linkingBlock = $('#linkingTextBlock'),
                $paymentBlock = $('#payingTextBlock');
            

            if( amount === 1 ){
                mode = 'linking';
                $linkingBlock.addClass('m_show').removeClass('m_hide');;
                $paymentBlock.removeClass('m_show').addClass('m_hide');;
            }
            else if ( amount > 1 ) {
                mode = 'paying';
                $paymentBlock.addClass('m_show').removeClass('m_hide');
                $linkingBlock.removeClass('m_show').addClass('m_hide');;
            }

            if (typeof mode != 'undefined' ){
                document.title = values[mode].title;
                $('#buttonPayment').val(values[mode].buttonText);
            }
            

        };

        //Маскируем номер карты
        this.panMasking = function(){

            // Маску применяем на НЕ САМСУНГИ!
            if( !navigator.userAgent.match(/SAMSUNG|SGH-[I|N|T]|GT-[I|N]|SM-[N|P|T|Z]|SHV-E|SCH-[I|J|R|S]|SPH-L/i)) {
                 $('#iPANMASKED').inputmask({ "mask": "9999 9999 9999 9999"});
            }

        };

        // Работа с продвинутым маскированием
        this.extendedMask = function(){

            var $input = $('#iPANMASKED');

            $input.bind('keyup', function(){
                renderVal(this);
            });

            function renderVal($input){

                var divider = ' ';
                var sectionWidth = 4;            

        
                var clearStr = $($input).val() //.replace(new RegExp(divider,'g'), '');
        
                var arr = clearStr.split('');
                var str = '';
                var st = 0;

                var caretPos = $($input).caret();
                var posShift = 0;
                var nextChar = '';



                for(var i = 0; i < arr.length; i++){

                    

                    if(st < (sectionWidth - 1)){

                        st++;
                        nextChar = arr[i];

                    }
                    else {
                        if( arr[i + 1] != divider ){

                            nextChar = arr[i] + divider;
                            posShift = 1;

                        }


                        st = 0;
                        

                    }

                    str += nextChar;

                    console.log('st = ' + st);
                    console.log('nextChar = ' + nextChar);
                    console.log('str = ' + str);

                }

                $($input).val(str);
                $($input).caret(caretPos + posShift);

                console.log('pos = ' + $($input).caret());
            };

        };

        // Постоянно проверяем поле со стоимостью заказа
        // так как альфабанк его меняет при инициализации
        this.observeAmount = function(){
            var self = this;
            $("#amount").bind("DOMSubtreeModified", function() {
                self.initPageMode();
            });
        };

        // Играемся с плэйсхолдерами - скрываем их по фокусу на поле
        this.changePlaceholder = function(){

            $('#iTEXT, #iCVC').focusin(function(){
                $(this).attr('ph',$(this).attr('placeholder')).attr('placeholder','');
            });

            $('#iTEXT, #iCVC').focusout(function(){
                $(this).attr('placeholder',$(this).attr('ph')).attr('ph','');
            });

        };

        // Проверка полей на валидность 
        this.checkForValid = function(){

            $('#iPAN, #iTEXT, #iCVC, #monthYear').each(function(){

                var input = $(this),
                    parentField = input.parent('.PaymentPage_Form_field'),
                    badClass; 

                if( input.attr('id') === 'monthYear' ){
                    badClass = 'm_fake';
                }
                else{
                    badClass = 'invalid';
                }
                              

                
                if( $(input).hasClass(badClass)) {
                    parentField.addClass('m_invalid');
                }
                else {
                    parentField.removeClass('m_invalid');   
                }
            });
        };

        // Проверка ДАТЫ на валидность 
        this.checkDateForValid = function(){

                var inputMonth = $('#month'),
                    inputYear = $('#year'),
                    parentField = inputMonth.parent('.PaymentPage_Form_field'),
                    badClass = 'invalid'; 

                if( $(inputMonth).hasClass(badClass) || $(inputYear).hasClass(badClass)) {
                    parentField.addClass('m_invalid');
                }
                else {
                    parentField.removeClass('m_invalid');   
                }
        };

        // Проверка полей на заполненость
        this.checkForFull = function(){

            $('#iPAN, #iTEXT, #iCVC').each(function(){
                var input = $(this),
                    inputVal = input.val(),
                    parentField = input.parent('.PaymentPage_Form_field');               


                if( input.val() !== '') {
                    parentField.addClass('m_full');
                }
                else {
                    parentField.removeClass('m_full');   
                }
            });
        };

        // Подменяем значение инпута ввода карты на маскированый
        this.changePanInputToMask = function(){
/*
            var inputPan = $('#iPAN'),
                inputPanMasked = $('#iPANMASKED'),
                inputPanMaskedParent = inputPanMasked.parent('.PaymentPage_Form_field');

            inputPan.val(inputPanMasked.val().replace(/\s+/g, ''));
            */
        };

        // Финт ушами с плэйсхолдером на дате
        this.dateFocusPlaceholder = function(){

            var fakeDateInput = $('#monthYear_fake'),
                realDateInput = $('#monthYear'),
                dateParent = realDateInput.parent('.PaymentPage_Form_field');

            fakeDateInput.focus(function(){
                $(this).toggleClass('m_fake');
                realDateInput.toggleClass('m_fake').focus();
                dateParent.addClass('m_full')
                
            });

        };

        // Подменяем селект месяца и года
        this.changeSelectToInput = function(){
            var expireDate = $('#monthYear'),
                expiredDateStr = expireDate.val().split("-");

            if(parseInt(expiredDateStr[0]) < 2015){
                expireDate.val('2015' + '-' + expiredDateStr[1]);
            }

            if( expireDate.val() == '' ){
                expireDate.val('2015-01');
            }

            $('#month').val(expiredDateStr[1]);
            $('#year').val(expiredDateStr[0]);
        };

        // Детектим браузер 
        this.detectBrowser = function(){
            var userAgent = navigator.userAgent || navigator.vendor || window.opera,
                PaymentBody = $('body');

            if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) {
                PaymentBody.addClass('ios');

            }
            else if( userAgent.match( /Android/i ) ) {
                PaymentBody.addClass('android');
            }
            else {
                PaymentBody.addClass('android');
            }
        };

        // Очищаем поля 
        this.clearInputs = function(){
            $('#iPAN_clear, #iTEXT_clear, #iCVC_clear').click(function(){
                var cleared = $(this).attr('cleared');
                $('#' + cleared).val('').removeClass('invalid');
            });
        };

        // Запускаем нашу валидацию принудительно по кнопке
        this.startValidation = function(){
            var self = this;
            $('#buttonPayment').click(function(){
                
                setTimeout(function(){
                    self.checkForValid();
                    self.checkDateForValid();
                },10);

            });
        }

        // Глобальный интервальный таймер
        this.globalInterval = function(){

            var self = this;
            setInterval(function() {

                self.changePanInputToMask();
                
                self.checkForFull();
                self.changeSelectToInput();
                self.checkDateForValid();

            }, 100);
        };

        this.init();

    }
       
    var Application = new app();

    })