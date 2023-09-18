const input=document.querySelector('input')
const letters=Array.from(document.querySelectorAll('[data-letters]'))
const specs=Array.from(document.querySelectorAll('[data-spec]'))
const textExample=document.querySelector('#textExample')
const symbolsPerMinute=document.querySelector('#symbolsPerMinute')
const WordsPerMinute=document.querySelector('#WordsPerMinute')
const errorPercent=document.querySelector('#errorPercent')

const text=`Проходя мимо Бермудских островов, мы попали под влияние местной погоды - то светит солнце и стоит невыносимое пекло, то идет огромная туча и под ней стена ливня, сквозь которую ничего не видно, то все небо усыпано облаками разных форм, оттенков и размеров и сияет радуга.
Интересно, в общем. Но потом все это прошло и была ясная жаркая погода почти без ветра. Вода гладкая и почти без волн, как будто в озере. Я себе Атлантический океан представлял иначе. Но через несколько дней атмосферное давление упало, поднялся ветер и нас начало валять с борта на борт. В общем весело, но не тогда, когда надо что-то делать. Например, надо точку на карту нанести, возьмешь линейку и тут эээх! Поехало все по столу и карандаш убежал. Или можно случайно ту же точку просто поставить совсем не туда, куда нужно. Но ничего, привыкли. Правда в душ было страшно ходить - там можно было легко убиться с такой качкой. И вот, мы пришли в Дувр (Великобритания). При заходе в порт открывается отличный вид: белые отвесные скалы огромной высоты, а наверху зеленые холмы. На одном из холмов располагается крепость , которая в данный момент является музеем. Эх, жаль что у нас была короткая стоянка, меньше суток. Так и не получилось сойти на берег. Но мы сейчас на линии, так что мы еще сюда вернемся, и не один раз. Паромы. Они большие и их много. Паромное сообщение с материком очень оживленное, примерно каждые 10-15 минут приходит или отходит очередной огромный паром, кое-как нашли интервал чтобы проскочить в порт и встать к причалу. Прошел день, грузовые операции по данному порту завершены и уже пора отчаливать и идти в следующий порт - Гамбург, Германия. Всего меньше суток переход и мы уже подходим к очередному порту. Гамбург находится на реке Эльба, в нескольких часах хода от моря. Пока шли до города, по обе стороны был приятный европейский пейзаж - аккуратные домики с мягким освещением, парки, беговые дорожки, все выглядит очень гармонично и уютно. На берегу пляжик с каяками, и даже прохладным вечером на пляже отдыхали люди в куртках, человек 30-50. Оставалось только смотреть и вздыхать. А чуть позже показался завод, с первого взгляда совсем неприметный, хоть и не маленький. А когда подошли чуть ближе, я увидел на стене логотип и надпись Airbus. Как сказал лоцман, это один из главных заводов Airbus в мире. И да, здание завода застеклено и со стороны реки было хорошо видно самолеты внутри. Точнее, самолеты в процессе сборки. У некоторых корпус еще желто-зеленого цвета, у других уже нанесена раскраска. 
В Гамбурге мы стояли так же как и в Дувре - всего день, тоже не удалось погулять, печально. 
И вот мы выгрузили часть бананов, разгрузили контейнера, погрузили новые и отправились в путь. 
Идем в Роттердам, Нидерланды (Голландия). Также переход меньше суток.`


const party = createParty(text)
console.log(party)
init()

function init() {
    input.addEventListener('keydown', keydownHandler)
    input.addEventListener('keyup', keyupHandler)
    viewUpdate()
}


function keydownHandler(event) {
    event.preventDefault();
    const letter=letters.find(x=>x.dataset.letters.includes(event.key))

    if (letter) {
        letter.classList.add('pressed')
        press(event.key)
        
    }
    let key = event.key.toLowerCase()

    if (key===' '){
        key='space'
        press(' ')
    }

    if (key==='enter') {
        press('\n')
    }

    const ownSpec =specs.filter(x=> x.dataset.spec===key)

    if (ownSpec.length) {
        ownSpec.forEach(spec=>spec.classList.add('pressed'))
    }



    console.warn('Неихвестный вид клавигшы', event)

}

function keyupHandler(event) {
    event.preventDefault();
    const letter=letters.find(x=>x.dataset.letters.includes(event.key))

    if (letter) {
        letter.classList.remove('pressed')
        
    }
    let key = event.key.toLowerCase()

    if (key===' '){
        key='space'
    }

    const ownSpec =specs.filter(x=> x.dataset.spec===key)

    if (ownSpec.length) {
        ownSpec.forEach(spec=>spec.classList.remove('pressed'))
    
    }
}

function createParty(text) {
    const party={
        text,
        strings:[],
        maxStringLenght:70,
        maxShowStrings:3,
        currentStringIndex:0,
        currentPrintedIndex:0,
        erros:[],

        statisticFlag:false,
        timerCounter:0,
        startTimer:0,
        errorCounter:0,
        commonCounter:0,
        wordCounter:0,
        started:false,

    }
    party.text=party.text.replace(/\n/g, '\n ')
    const words=party.text.split(' ')

    let string=[]
    for(const word of words){
    const newStringLenght=[...string, word].join(' ').length+!word.includes('\n')

        if (newStringLenght>party.maxStringLenght) {
            party.strings.push(string.join(' ')+' ')
            string=[]
        }
        string.push(word)
        if (word.includes('\n')) {
            party.strings.push(string.join(' '))
            string=[]
        }
    }

    if (string.length) {
        party.strings.push(string.join(' '))
        
    }

    return party
}

function press(letter) {
    party.started=true
    if(!party.statisticFlag){
        party.statisticFlag=true
        party.startTimer=Date.now()
    }

    const string=party.strings[party.currentStringIndex]
    const mustLetter=string[party.currentPrintedIndex]

    if(letter===mustLetter){
        party.erros=[]
        if (letter===' ' && party.strings[party.currentStringIndex+1]!=='-') {
            party.wordCounter++
        }
        
        party.currentPrintedIndex++
        

        if(string.length<=party.currentPrintedIndex){
            party.currentPrintedIndex=0
            party.currentStringIndex++

            party.statisticFlag=false
            party.timerCounter=Date.now()-party.startTimer
        }
    }
    else if(!party.erros.includes(mustLetter)){
        if(party.erros<1){
            party.erros.push(mustLetter)
        }
        
        party.errorCounter++
    }
    party.commonCounter++
    viewUpdate()

    console.log(letter, mustLetter)
}


function viewUpdate() {
    const string=party.strings[party.currentStringIndex]
    const mustLetter=string[party.currentPrintedIndex]

    const showedStrings=party.strings.slice(
        party.currentStringIndex,
        party.currentStringIndex + party.maxShowStrings
    );
    const div =document.createElement('div')

    const firstLine=document.createElement('div')
    firstLine.classList.add('line')
    div.append(firstLine)


    const done=document.createElement('span')
    done.classList.add('done')
    done.textContent=string.slice(0,party.currentPrintedIndex)
    firstLine.append(
        done,
        ...string
        .slice(party.currentPrintedIndex)
        .split("")
        .map((letter)=>{
            if(letter===' '){
                return '·'
            }

            if(letter==='\n'){
                return '¶'
            }

            if(party.erros.includes(letter)){
                if(party.erros<1){
                    const errorSpan = document.createElement('span')
                    errorSpan.classList.add('hint')
                    errorSpan.textContent=letter
                }
                console.log(typeof(errorSpan))
                return errorSpan
            }
            
            
            return letter
        })
    )

    for(let i=1; i<showedStrings.length;i++){
        const line=document.createElement('div')
        line.classList.add('line')
        div.append(line)
        line.append(
            ...showedStrings[i]
            .split("").
            map((letter)=>{
                if(letter===' '){
                    return '·'
                }

                if(letter==='\n'){
                    return '¶'
                }
                
                
                return letter})
        ) 
    }




    textExample.innerHTML=''
    textExample.append(div)
    

    input.value=string.slice(0, party.currentPrintedIndex)

    if(!party.statisticFlag&&party.started){
        symbolsPerMinute.textContent=Math.round(
            (60000*party.commonCounter)/party.timerCounter)
        WordsPerMinute.textContent=Math.round(
            (60000*party.wordCounter)/party.timerCounter)
        errorPercent.textContent=Math.floor((10000*party.errorCounter)/party.commonCounter/100)+'%'
    }

}


