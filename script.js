const input=document.querySelector('input')
const letters=Array.from(document.querySelectorAll('[data-letters]'))
const specs=Array.from(document.querySelectorAll('[data-spec]'))
const textExample=document.querySelector('#textExample')
const symbolsPerMinute=document.querySelector('#symbolsPerMinute')
const errorPercent=document.querySelector('#errorPercent')

const text=`Актуальность исследования. Один из древнейших народов Центральной Азии - монголы внесли свой вклад в развитие мировой цивилизации.
Между тем история монгольского народа на всем ее протяжении не получила достаточно достоверного и правдивого освещения в научной литературе.
Это относится, прежде всего, к средневековой истории Монголии, особенно к периоду существования Монгольской империи и деятельности Чингис-хана.
До недавнего времени сколько-нибудь объективное исследование истории монгольского средневекового государства не было возможным в силу политических обстоятельств.
Более чем 300-летняя история монгольского владычества на значительной части Азии и Европы рассматривалась исключительно в негативных и идеологических аспектах.
Однако научный подход не может основываться на оценках «хорошо» или «плохо» и требует более объективной и аргументированной оценки монгольской государственности и истории периода монгольской империи, которая, по выражению идеолога евразийства П. Савицкого, является «одной из важных глав в истории мира» [Савицкий, 1931].`


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
        party.currentPrintedIndex++

        if(string.length<=party.currentPrintedIndex){
            party.currentPrintedIndex=0
            party.currentStringIndex++

            party.statisticFlag=false
            party.timerCounter=Date.now()-party.startTimer
        }
    }
    else if(!party.erros.includes(mustLetter)){
        party.erros.push(mustLetter)
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
                const errorSpan = document.createElement('span')
                errorSpan.classList.add('hint')
                errorSpan.textContent=letter
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

                if(party.erros.includes(letter)){
                    const errorSpan = document.createElement('span')
                    errorSpan.classList.add('hint')
                    errorSpan.textContent=letter
                    return errorSpan
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
        errorPercent.textContent=Math.floor((10000*party.errorCounter)/party.commonCounter/100)+'%'
    }

}



/* <div>
					<div class="line line-1">
					<span class="done"> На переднем плане, прямо перед</span>
					<span class="hint">н</span>ами, расположен был дворик, где стоял
				</div>
				<div class="line">
					наполовину вычищенный автомобиль. Шофер Остин был на этот раз
				</div>
				<div class="line">
					уволен окончательно и бесповоротно. Он раскинулся на земле,
				</div>
</div> */