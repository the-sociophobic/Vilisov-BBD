import React, { Component } from 'react'
import debounce from 'debounce'
import clamp from 'clamp'

import WordChanger from 'components/WordChanger'
import ControlsHelper from 'components/ControlsHelper'
import DownloadLinks from 'components/DownloadLinks'
import ExternalLink from 'components/ExternalLink'
import VideoModal from 'components/VideoModal'
import Arrow from 'components/Arrow'


const numberOfSlides = 3
const slides = ["intro", "desc", "credits"]

export default class TextArea extends Component {
  constructor(props) {
    super(props)

    this.state = {
      currentSlide: 0,
      showVideoModal: false,
    }

    this.scrollableContainerRef = React.createRef()
    this.scrollableContentRef = React.createRef()
  }

  componentDidMount = () =>
    this.scrollableContainerRef.current
      .addEventListener("scroll", e => this.debouncedOnScroll(e))

  componentWillUnmount = () =>
    this.scrollableContainerRef.current
      .removeEventListener("scroll", e => this.debouncedOnScroll(e))

  onScroll = e => {
    // console.log(this.scrollableContentRef.current.getBoundingClientRect().top)
    // console.log(this.scrollableContentRef.current.scrollTop)
    const scrollAlpha = -this.scrollableContentRef.current.getBoundingClientRect().top / this.getMaxScroll()
    const currentSlide = parseInt(Math.floor(scrollAlpha * .999 * numberOfSlides))

    if (currentSlide !== this.state.currentSlide)
      this.setState({
        currentSlide: currentSlide,
      })
  }
  debouncedOnScroll = e =>
    debounce(this.onScroll(e), 100)
  
  getMaxScroll = () =>
    this.scrollableContainerRef.current &&
    this.scrollableContentRef.current ?
      this.scrollableContentRef.current.clientHeight - this.scrollableContainerRef.current.clientHeight
      :
      0

  nextSlide = () =>
    document
      .getElementById(slides[this.state.currentSlide + 1])
      .scrollIntoView()
  prevSlide = () =>
    document
      .getElementById(slides[this.state.currentSlide - 1])
      .scrollIntoView()

  render = () =>
    <div className="landing">
      
      <div className={"landing__content landing__content--" + this.state.currentSlide}>

        <h1 className="landing__content__h1">
          SITTING&nbsp;IN&nbsp;A<br />
          ROOM.&nbsp;I&nbsp;AM.
        </h1>

        <div className="landing__content__description-0">
          это не <WordChanger words={["кино", "перформанс", "игра", "подкаст", "шоу", "спектакль"]} /><br />это всё вместе. и что-то другое.
        </div>

        <div className="landing__content__description-1">
          что голодная смерть британца в тяжёлой депрессии может рассказать нам о том, как мы распоряжаемся ресурсами и будем распоряжаться ими в будущем? что такое безусловный базовый доход? как изменится ваша жизнь, получай вы каждый месяц зарплату только за то, что живёте? 
        </div>

        <div className="landing__content__description-2">
          представьте: вы каждый месяц получаете зарплату просто за то, что живёте. можно продолжать работать или делать что угодно — выплата безусловная и не ограничена по времени. как изменится ваша повседневность? как изменится жизнь ваших соседей и сограждан, получай они те же выплаты? 
          <br /><br />
          безусловный базовый доход — одна из самых заметных больших идей, формирующих будущее. сейчас она актуальна как никогда: эпоха постработы наступает вместе с повальной автоматизацией, освобождая время для творчества, но и оставляя миллионы людей незащищёнными. 
          <br /><br />
          мы узнали всё, что нужно знать про базовый доход, и собрали несколько документальных историй о том, как ББД мог бы буквально спасать жизни. как проходили пилотные тестирования базового дохода? перестают ли люди работать? как базовый доход освобождает женщин из рабства и спасает от изнасилований? как он помогает исключить унижение из отошений государства и гражданина? почему с БД люди чувствуют себя стабильно лучше? и при чём тут композитор элвин люсье? SITTING IN A ROOM. I AM. — это иммерсивный опыт в дополненной реальности, который отвечает на все эти вопросы; прямо у вас в комнате. 
        </div>

        <div className="landing__content__credits">
          <span className="green">голоса</span> саша&nbsp;старость, мария&nbsp;кувшинова, катя&nbsp;мокшанкина, алексей&nbsp;доронин, оксана&nbsp;погребняк, слава&nbsp;перовский, артём&nbsp;томилов, марина&nbsp;ганах, дмитрий&nbsp;отяковский
          <br /><br />
          <span className="green">видео</span> павел&nbsp;князев<br />
          <span className="green">лэндинг</span> лев&nbsp;васильев<br />
          <span className="green">звук</span> леонид&nbsp;именных<br />
          <span className="green">разработка</span> артём&nbsp;васич, илья&nbsp;саяпин<br />
          <span className="green">текст, продакшн, AR&#8209;сцены</span> виктор&nbsp;вилисов<br />
        </div>

        <div className="landing__content__links">
          <div
            className="landing__content__links__item"
            onClick={() => this.setState({showVideoModal: true})}
          >
            трейлер
          </div>
          <ExternalLink newTab to="https://anchor.fm/apolloniada/episodes/500-ef0226">
            <div className="landing__content__links__item">
              подкаст
            </div>
          </ExternalLink>
        </div>

        <DownloadLinks />

      </div>

      <div
        ref={this.scrollableContainerRef}
        className="landing__scrollable"
      >
        <div
          ref={this.scrollableContentRef}
          className="landing__scrollable__long-part"
        >
          {slides.map(slide =>
            <div
              className="anchor"
              id={slide}
            />
          )}
        </div>
      </div>

      <ControlsHelper />

      {this.state.currentSlide > 0 &&
        <Arrow
          left
          onClick={() => this.prevSlide()}
        />}
      {this.state.currentSlide < numberOfSlides - 1 &&
        <Arrow
          onClick={() => this.nextSlide()}
        />}

      <VideoModal
        show={this.state.showVideoModal}
        hide={() => this.setState({showVideoModal: false})}
      />

    </div>
}

