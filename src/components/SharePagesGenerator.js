import React from 'react'

import download from 'downloadjs'

import { coinCodes } from 'libs/utils/coinCodes'


const generationOffset = 350

export default class SharePagesGenerator extends React.Component {
  componentDidMount = () => {
    download(`
      <html>
        <head>  
          <meta charset="utf-8" />
          <link rel="icon" href="https://apollonia.today/favicon.png" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#000000" />
          <meta
            name="description"
            content="что голодная смерть британца в тяжёлой депрессии может рассказать нам о том, как мы распоряжаемся ресурсами и будем распоряжаться ими в будущем? что такое безусловный базовый доход? как изменится ваша жизнь, получай вы каждый месяц зарплату только за то, что живёте?"
          />
          <!-- Primary Meta Tags -->
          <title>SITTING IN A ROOM. I AM.</title>
          <meta name="title" content="SITTING IN A ROOM. I AM.">
          <meta name="description" content="Перформанс в дополненной реальности про базовый доход">

          <!-- Open Graph / Facebook -->
          <meta property="og:type" content="website">
          <meta property="og:url" content="https://apollonia.today/ubi/share/${coinCodes[this.props.amount]}.html">
          <meta property="og:title" content="SITTING IN A ROOM. I AM.">
          <meta property="og:description" content="Перформанс в дополненной реальности про базовый доход">
          <meta property="og:image" content="https://apollonia.today/ubi/og-images/${this.props.amount}.png">

          <!-- Twitter -->
          <meta property="twitter:card" content="summary_large_image">
          <meta property="twitter:url" content="https://apollonia.today/ubi/share/${coinCodes[this.props.amount]}.html">
          <meta property="twitter:title" content="SITTING IN A ROOM. I AM.">
          <meta property="twitter:description" content="Перформанс в дополненной реальности про базовый доход">
          <meta property="twitter:image" content="https://apollonia.today/ubi/og-images/${this.props.amount}.png">
        <head>
        <body>
          <script>window.location.href = "https://apollonia.today/ubi"</script>
        </body>
      <html>
    `, `${coinCodes[this.props.amount]}.html`)
   
    setTimeout(() => window.location.reload(), generationOffset)
  }
  
  render = () =>
    this.props.amount
}
