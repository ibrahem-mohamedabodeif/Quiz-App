let qContainer = document.querySelector( ".container .quistion" );

let answersContainer = document.querySelector( ".container .answers" );

let nextButton = document.querySelector( "button" )

let time = document.querySelector( ".time" );

let finalResult = document.querySelector( ".result" );


let currentIndex = 0;

let rightAnswers = 0;


function getQuistions ()
{
    let Request = new XMLHttpRequest();

    Request.onreadystatechange = function()
    {
        if ( this.readyState === 4 && this.status === 200 )
        {
            let quistions = JSON.parse( this.responseText );

            let qCount = quistions.length;

            addQuistions( quistions[ currentIndex ], qCount );

            countdown( 120, qCount );

            nextButton.onclick = () =>
            {
                let theRightAnswer = quistions[ currentIndex ].correctAnswer;

                currentIndex++;

                checkAnswer( theRightAnswer, qCount );

                qContainer.innerHTML = "";

                answersContainer.innerHTML = "";

                addQuistions( quistions[ currentIndex ], qCount );

                clearInterval( countdownInterval );

                countdown( 120, qCount );

                Result( qCount );
            };
        }
    };

    Request.open( "Get", "quistion.json", true );
    Request.send();
}

getQuistions();


function addQuistions ( obj, count )
{
    // add quistion title

    if ( currentIndex < count )
    {

        let quistion = document.createElement( "p" );

        let qText = document.createTextNode( obj[ "title" ] );

        quistion.appendChild( qText );

        qContainer.appendChild( quistion );

        // add answers

        for ( let i = 1; i <= 4; i++ )
        {
            let spans = document.createElement( "span" );

            spans.dataset.answer = obj[ `answer-${ i }` ];

            let spansText = document.createTextNode( obj[ `answer-${ i }` ] );

            spans.appendChild( spansText );

            answersContainer.appendChild( spans );


            spans.onclick = ( e ) =>
            {
                let answerSpans = document.querySelectorAll( ".answers span" );

                answerSpans.forEach( ( span ) =>
                {
                    span.classList.remove( "choose" );
                } );

                e.target.classList.add( "choose" );
            };

        }
    }
};


function checkAnswer ( rAnswer, count )
{
    let answers = document.querySelectorAll( ".answers span" );
    let theChoosenAnswer;

    for ( let i = 0; i < answers.length; i++ )
    {
        if ( answers[ i ].classList.contains( "choose" ) )
        {
            theChoosenAnswer = answers[ i ].dataset.answer;
        }
    }
    if ( rAnswer === theChoosenAnswer )
    {
        rightAnswers++;
    }
}


function Result ( count )
{
    if ( currentIndex === count )
    {
        qContainer.remove();
        answersContainer.remove();
        nextButton.remove();
        time.remove();
        document.querySelector( ".quiz h1" ).remove();

        let body = document.querySelector( "body" );
        body.style.backgroundImage = "url('./Done-rafiki.png')";
        body.style.backgroundSize = "cover";

        finalResult.style.display = "block";

        let percentage = parseInt( ( rightAnswers / count ) * 100 );

        finalResult.innerHTML = `<p>Result: ${ rightAnswers } out of ${ count } (${ percentage }%)</p>`;
    }
}


function countdown ( duration, count )
{
    if ( currentIndex < count )
    {
        let min, sec;

        countdownInterval = setInterval( () =>
        {
            min = parseInt( duration / 60 );

            sec = parseInt( duration % 60 );

            min = min < 10 ? `0${ min }` : min;
            sec = sec < 10 ? `0${ sec }` : sec;

            time.innerHTML = `${ min }:${ sec }`;

            if ( --duration < 0 )
            {
                clearInterval( countdownInterval );

                nextButton.click()
            }
        }, 1000 )
    }
}
