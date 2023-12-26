---
title: Entwined 2023
layout: rime
attrs:
  main:
    class: content-grid

hoagies:
  - iframe: https://bandcamp.com/EmbeddedPlayer/album=203876381/size=small/bgcol=ffffff/linkcol=2ebd35/transparent=true/
    height: 42
    width: 509
    title: hoagies
---
{% import "content.macros.njk" as content %}

And lo, when the Imperium marches.....

{{ content.figure(
    hoagies,
    caption='Most important hoagie of the year',
    attrs={class: 'popout'}
) }}
