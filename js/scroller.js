function $(str) { return document.querySelector(str) }

function hasClass(el, name) {
   return new RegExp('(\\s|^)'+name+'(\\s|$)').test(el.className);
}

function addClass(el, name)
{
   if (!hasClass(el, name)) { el.className += (el.className ? ' ' : '') +name; }
}

function removeClass(el, name)
{
   if (hasClass(el, name)) {
      el.className=el.className.replace(new RegExp('(\\s|^)'+name+'(\\s|$)'),' ').replace(/^\s+|\s+$/g, '');
   }
}


var Scroller = {
	posX : 0,
	posY : 0,
	content : null,
	sizeX : 0,
	sizeY : 0,
	w:0,
	h:0,

	updatePosition : function(){
		with (this) {
			content.style.left=-posX*w+'px';
			content.style.top=-posY*h+'px';
		}	
	},

	left : function(){
		with (this) {
			posX -= 1;
			posX = (posX<0) ? 0 : posX;
			updatePosition()
		}
	},

	right : function(){
		with (this) {
			posX += 1;
			posX = (posX>sizeX-1) ? sizeX-1 : posX;
			updatePosition()
		}
	},

	up : function(){
		with (this) {
			posY -= 1;
			posY = (posY<0) ? 0 : posY;
			updatePosition()
		}		
	},

	down : function(){
		with (this) {
			posY += 1;
			posY = (posY>sizeY-1) ? sizeY-1 : posY;
			updatePosition()
		}
	},

	moveto : function(x,y) {
		with (this) {
			posY = y
			posY = (posY<0) ? 0 : posY
			posY = (posY>sizeY-1) ? sizeY-1 : posY
			posX = x
			posX = (posX<0) ? 0 : posX
			posX = (posX>sizeX-1) ? sizeX-1 : posX
			updatePosition()
		}
	},

	init : function(x,y,sx,sy,width,height,contentSelector){
		with (this) {
			posX = x;
			posY = y;
			sizeX = sx;
			sizeY = sy;
			content = document.querySelector(contentSelector);
			content.style.position='relative'
			w=width
			h=height
		}
		return this;

	}
}

var scroll = null;

function Registration() {
    var blocks = {},
        selectors = {
            'rules' : '#rules',
            'form' : '#regBlock',
            'formData' : '#regFormData',
            'langPanel' : '#langPanel',
            'confirm' : '#confirm',
            'nextBtn' : '#nextBtn',
            'canselBtn' : '#CancelBtn',
            'wait' : '#wait'
        },
        fieldSelectors = {
            'name' : '#Name',
            'surname' : '#SurName',
            'group' : '#Group',
            'pass' : '#Pass',
            'pass2' : '#CPass',
            'mail' : '#EMail'            
        },
        fields = {},
        warningCodes = {
        	'name' : '',
        	'surname' : '',
        	'group' : '',
        	'pass' : '',
        	'mail' : ''
        },
        languageData = {
        	'ua' : {
        		'name' : 'Ім\'я',
        		'surname' : 'Прізвище',
        		'group' : 'Номер залікової книжки',
        		'pass' : 'Пароль',
        		'pass2' : 'Підтвердження паролю',
        		'mail' : 'Електронна пошта',
        		'emptyName' : 'Пусте поле ім\'я',
        		'emptySurName' : 'Пусте поле прізвища',
        		'emptyGroup' : 'Пусте поле номера залікової книжки',
        		'badGroup' : 'Некоректний номер залікової книжки',
        		'emptyPass' : 'Пусте поле паролю',
        		'badPass' : 'Некоректний пароль',
        		'difPass' : 'Паролі не збігаються',
        		'emptyMail' : 'Пусте поле електронної пошти',
        		'badMail' : 'Некоректна електронна пошта',
        		'wait' : 'Будь ласка зачекайте'
        	},
        	'eng' : {
        		'name' : 'Name',
        		'surname' : 'Last name',
        		'group' : 'Number of academic records',
        		'pass' : 'Pass',
        		'pass2' : 'Confirm Password',
        		'mail' : 'Email Address',
        		'emptyName' : 'Empty name',
        		'emptySurName' : 'Empty last name',
        		'emptyGroup' : 'Empty number of academic records',
        		'badGroup' : 'Invalid academic record',
        		'emptyPass' : 'Empty pass',
        		'badPass' : 'bad pass',
        		'difPass' : 'Different pass',
        		'emptyMail' : 'Empty email',
        		'badMail' : 'bad mail',
        		'wait' : 'Please wait'
        	}
        },
        language = 'ua',
        mode = 'rules',
        timerId = 0,
        time = 0;

    function hide(el){
    	el.style.display="none";
    }

    function show(el){
    	el.style.display="block";
    }

    function isBadStr() {
    	//console.log(arguments)
        for (var key in arguments)
            if (arguments[key]) return false
        return true;
    }

    function warningCodeGet(value,flagVal,flag){
        if (flag === undefined) 
            return (value) ? '' : flagVal
        else {
            if (value) 
                return (flag) ? '' : flagVal[0]
            else return flagVal[1]
        }
    }

    function checkEmail(){
        var mail = fields.mail.value
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        warningCodes.mail = warningCodeGet(mail,[languageData[language]['badMail'],
            languageData[language]['emptyMail']],reg.test(mail))
        return isBadStr(warningCodes.mail) 
    }

    function checkNames(){
        warningCodes.name = warningCodeGet(fields.name.value,languageData[language]['emptyName'])
        warningCodes.surname = warningCodeGet(fields.surname.value,languageData[language]['emptySurName'])
        return isBadStr(warningCodes.name,warningCodes.surname)
    }

    function checkPass() {
        if (fields.pass.value==fields.pass2.value) {
            var reg = /[^A-Za-z0-9!@#\$%\^&\*()_\+-=]/
            var flag = !reg.test()
            console.log(reg.test())
            warningCodes.pass = warningCodeGet(fields.pass.value,[languageData[language]['badPass'],languageData[language]['emptyPass']],flag)
        }
        else warningCodes.pass = languageData[language]['difPass']
        return isBadStr(warningCodes.pass)
    }

    function checkGroup() {
        var group = $(fieldSelectors.group).value.toLowerCase()
        group = group.replace('с','s')
        group = group.replace('п','p')
        group = group.replace('і','i')
        if (group!=fields.group.value)
        	fields.group.value=group
        warningCodes.group = warningCodeGet(group,[languageData[language]['badGroup'],
            languageData[language]['emptyGroup']],
            (group[0]=='i' && (group[1]=='p' || group[1]=='s') && group.length==6))
        return isBadStr(warningCodes.group)
    }

    function check(){
        //console.log(checkNames(),checkGroup(),checkPass(),checkEmail())
        var r = checkNames() + checkGroup() + checkPass() + checkEmail() 
        return (r<4) ? false : true
    }

    function removeToolTip(el){
    	removeClass(el.parentNode.parentNode.querySelector('.tool-tip'),'tool-tip-show')
    	addClass(el.parentNode,'input-correct')
    }

    function addToolTip(el,str){
    	removeClass(el.parentNode,'input-correct')
		addClass(el.parentNode.parentNode.querySelector('.tool-tip'),'tool-tip-show')
		el.parentNode.parentNode.querySelector('.tool-tip').innerHTML = str;
    }

    function applyLanguage(e){
    	if (typeof e != "string") {
			language = e.target.getAttribute('data-lang')
    	}
    	else language = e
    	for (var key in fields)
    	{
    		//console.log(key,fields[key].parentNode.parentNode.querySelector('span'))
    		fields[key].parentNode.parentNode.querySelector('span').innerHTML = languageData[language][key]
    	}
    	check()
    	for (var key in warningCodes)
    		fields[key].parentNode.parentNode.querySelector('.tool-tip').innerHTML = warningCodes[key]
    	blocks.wait.innerHTML = languageData[language]['wait']
    }

    function fieldChecker(e){
        check()
    	for (var key in warningCodes) {
    		if (e.target == fields[key] || (key=='pass' && e.target == fields['pass2']))
	    		if (warningCodes[key]) {
                    console.log(key,'add')
	    			addToolTip(fields[key], warningCodes[key])
	    			if (key=='pass') removeClass(fields['pass2'].parentNode,'input-correct')
	    		} else {
                    console.log(key,'del')
	    			removeToolTip(fields[key]);
	    			if (key=='pass') removeToolTip(fields['pass2']);
	    		}
	    }
    }

    function waiterLoop(){
    	if (time == 0) {
    		blocks.wait.style.display='none'
    		blocks.nextBtn.disabled = false
    		clearInterval(timerId)
		} else {
			blocks.wait.innerHTML = languageData[language]['wait'] + ' ' + time;
			time--;
    	}
    }

    function init() {
    	mode = 'rules'
        for (var key in selectors)
            blocks[key] = $(selectors[key])       
        for (var key in fieldSelectors)
        	fields[key] = $(fieldSelectors[key])
        blocks.nextBtn.addEventListener('click',nextBtnClick)
        blocks.formData.addEventListener('keyup',fieldChecker)
        applyLanguage(language)
        waiterLoop()
        console.log(fields)
        blocks.langPanel.addEventListener('click',applyLanguage)
        timerId = setInterval(waiterLoop, 1000);
    }

    function nextBtnClick() {
    	if (mode=='rules') {
    		//check time
    		mode='fillData'
    		scroll.moveto(1,0)
    	} else if (mode=='fillData') {
    		if (check()) {
    			mode='confirm'
    			blocks.confirm.innerHTML = 	'Ім\'я : '+$(fieldSelectors.name).value+'<br>'+
            								'Прізвище : '+$(fieldSelectors.surname).value+'<br>'+
            								'Номер заліковки : '+$(fieldSelectors.group).value+'<br>'+
            								'Електронна пошта : '+$(fieldSelectors.mail).value+'<br>'

    			scroll.moveto(2,0)
    		} else {
    			for (var key in warningCodes) {
		    		if (warningCodes[key]) 
		    			addToolTip($(fieldSelectors[key]), warningCodes[key])
		    		else
		    			removeToolTip($(fieldSelectors[key]))
    			}
    		}
    	} else if (mode=='confirm') {
    		blocks.form.submit()
    	}
    }
/*
    function regBtnClick() {
        blocks.form.submit()
    }

    function canselBtnClick() {
        blocks.confirm.fadeOut('fast');
        blocks.formData.slideDown('fast')
    }

    function ruleBtnClick() {
        //console.log(rulesBlock, errorBlock, checkBlock, formBlock, mainFormBlock);
        blocks.rules.hide()
        blocks.warning.hide()
        blocks.confirm.hide()
        blocks.formData.show()
        blocks.form.slideDown('fast')
    }

    function checkBtnClick() {
        
        if (check()) {
            blocks.formData.slideUp('fast')
            blocks.warning.slideUp('fast')
            blocks.confirm.fadeIn('fast')
            blocks.checkInfo.html('');
        } else {
            blocks.warning.hide()
            blocks.confirm.slideUp('fast')
            blocks.warning.html('');
            //console.log(warningCodes)
            for (var key in warningCodes) {
                if (warningCodes[key]) blocks.warning.append(warningCodes[key]+'<br>')
            }
            blocks.warning.slideDown('fast')
        }
    }
*/
    init();
}

window.onload = function(){
	scroll = Scroller.init(0,0,3,1,410,416,"#scrollerContent")
	//document.querySelector('#leftBtn').addEventListener('click',function(){ scroll.left() })
	Registration();
	//document.querySelector('#botBtn').addEventListener('click',function(){ scroll.down() })
	//document.querySelector('#topBtn').addEventListener('click',function(){ scroll.up() })
}