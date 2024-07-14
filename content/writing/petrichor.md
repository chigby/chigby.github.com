---
title: Petrichor
subtitle: Advent of the Witch
description: Zine of art-a-day surreality
layout: rime
tags: writing
---
{% import "content.macros.njk" as content %}
{% for q in gallery %}
<article class="full">
    {{ content.figure([q], caption=q.caption, gallery="petrichor", attrs={class: "petrichor-image"}) }}
</article>
{% endfor %}
