var pq = {};

pq.VERSION = 1;

pq.progress = 0;
pq.paused = false;
pq.speed = 200;

$(document).ready(function () {
  $("#restart").click(pq.do_restart);
  $("#faster").click(pq.do_speedup);
  $("#slower").click(pq.do_slowdown);
  $("#pause").click(pq.do_toggle_pause);

  if (typeof String.prototype.startsWith != 'function') {
    String.prototype.startsWith = function (str){
      return this.slice(0, str.length) == str;
    };
  }

  if (typeof String.prototype.endsWith != 'function') {
    String.prototype.endsWith = function (str){
      return this.slice(-str.length) == str;
    };
  }
  pq.log2 = function (x) {
    return Math.log(x) / Math.LN2;
  }

  var json = pq.restore();
  if (json) {
    console.log("restoring old character");
    pq.character = json;
    if (!pq.character.realm) pq.init_realm(pq.generate_realm(pq.character.level), 100);
    if (!pq.character.gender) pq.init_gender();
  } else {
    console.log("starting new character");
    pq.start();
  }
  pq.clear_display();
  pq.draw_player();
  pq.doturn();
});

pq.do_restart = function () {
  pq.clear_display();
  pq.start();
  pq.draw_player();
}

pq.do_toggle_pause = function () {
  pq.paused = !pq.paused;
  if (pq.paused) {
    $("#pause").text("unpause");
  } else {
    $("#pause").text("pause");
  }
}

pq.do_speedup = function () {
  $("#slower").prop("disabled", false);
  pq.speed = Math.max(50, pq.speed / 2);
  if (pq.speed == 50) $("#faster").prop("disabled", true);
}

pq.do_slowdown = function () {
  $("#faster").prop("disabled", false);
  pq.speed = Math.min(1600, pq.speed * 2);
  if (pq.speed == 1600) $("#slower").prop("disabled", true);
}

pq.save = function () {
  localStorage.setItem("pq:current", JSON.stringify(pq.character));
};

pq.restore = function () {
  var json = JSON.parse(localStorage.getItem("pq:current"));
  return (json && json.version == pq.VERSION) ? json : null;
};

pq.clear_display = function () {
  $("#name").text("");
  $("#profession").text("");
  $("#level").text("");
  $("#xp").text("");
  $("#next").text("");
  $("#weapon").text("");
  _.each(pq.data.slots, function (slot) { $("#" + slot).text("") });
  $("#transport").text("");
  $("#inventory").text("");
  $("#log").text("");
  $("#rlog").text("");
};

pq.start = function () {
  var profession = pq.choose(pq.data.professions);
  var name = pq.choose(pq.data.names);
  var title = pq.choose(pq.data.titles);

  pq.init_player(name + " the " + title, profession);
  pq.init_realm(pq.generate_realm(pq.character.level), 100);
}

pq.doturn = function () {
  if (pq.paused) {
    $("#progress").text("paused   ");
  } else {
    var stars = Array(pq.progress + 1).join("*");
    var spaces = Array(10 - pq.progress).join(" ");
    $("#progress").text(stars + spaces);
    pq.progress = (pq.progress + 1) % 10;
    if (pq.character.realm.progress == 0) {
      $("#rlog").append(pq.character.realm.name + " is at peace\n");
      pq.init_realm(pq.generate_realm(pq.character.level), pq.dice(4, 100)+50);
      pq.draw_player();
    } else {
      var nstars = Math.floor((30*pq.character.realm.progress)/pq.character.realm.size);
      var rstars = Array(nstars + 1).join("*");
      var rspaces = Array(30 - nstars).join(" ");
      $("#rprogress").text(rstars + rspaces);
    }
    pq.character.realm.progress = (pq.character.realm.progress + 1) % pq.character.realm.size;
    if (pq.progress == 0) {
      var f = pq.generate_foe(pq.die(20), pq.character.level);
      var o = pq.generate_object(pq.character.level);
      pq.pickup(o);
      var xp = pq.die(1000);
      pq.gain_xp(xp);
      pq.do_social();
      pq.draw_player();
      $("#log").append("defeated " + pq.quantify(f.name, f.qty) + "\n");
      $("#log").append("  found " + o.name + " (" + xp + " xp)\n");
      pq.save();
    }
  }
  if (true) {
    setTimeout(pq.doturn, pq.speed);
  } else {
    $("#log").append("done.\n");
  }
};

pq.init_realm = function(realm, size) {
  pq.character.realm = {
    'name': realm.name,
    'size': size,
    'progress': 1,
  };
};

pq.ceil_sqrt = function (x) {
  return Math.ceil(Math.sqrt(x));
};

pq.do_social = function () {
  var c = pq.character;
  var lvl2 = Math.ceil(Math.sqrt(c.level));

  if (!c.friends) c.friends = 0;
  if (!c.lovers) c.lovers = 0;
  if (!c.twitter) c.twitter = 0;
  if (!c.tumblr) c.tumblr = 0;
  if (!c.patreon) c.patreon = 0;

  if (pq.one_in(Math.ceil(0.7 * c.friends + 1))) c.friends += 1;
  if (pq.one_in(9 * c.lovers + 2)) c.lovers = Math.max(c.lovers - 1, 0);
  if (pq.one_in(4 * c.lovers * c.lovers + 1)) c.lovers += 1;
  if (pq.one_in(Math.ceil(10 / pq.ceil_sqrt(c.level)))) c.twitter += pq.die(c.level * Math.ceil(Math.sqrt(c.level)));
  if (pq.one_in(Math.ceil(20 / pq.ceil_sqrt(c.level)))) c.tumblr += pq.die(c.level * Math.ceil(Math.sqrt(c.level)));
  if (pq.one_in(Math.ceil(40 / pq.ceil_sqrt(c.level)))) c.patreon += pq.die(Math.ceil(c.level / 1.5));
};

pq.init_player = function (name, profession) {
  pq.character = {
    "version": pq.VERSION,
    "name": name,
    "level": 1,
    "profession": profession,
    "gender": gender,
    "pronouns": pronouns,
    "friends": 0,
    "lovers": 0,
    "twitter": 0,
    "tumblr": 0,
    "patreon": 0,
    "weapon": null,
    "slots": {},
    "transport": null,
    "powers": [],
    "pack": [],
    "xp": 0,
    "next": pq.next_level_xp(1)
  };

  pq.init_gender();
};

pq.init_gender = function () {
  var cat = pq.choose(pq.data.gendercats);
  console.log("init gender: %o", cat);
  pq.character.gender = pq.choose(pq.data.genders[cat]);
  cat = pq.one_in(5) ? "neutral" : cat;
  pq.character.pronouns = pq.choose(pq.data.pronouns[cat]);
};

pq.quantify = function(s, qty) {
  if (qty !== 1) {
    return qty.toString() + ' ' + s;
  } else {
    return pq.a(s);
  }
};

pq.a = function (s) {
  return s.match(/^[aeiou]/) ? "an " + s : "a " + s;
};

pq.pluralize = function (s) {
  if (s === 'zombie') {
    return 'zombies'
  } else if (s == 'hero') {
    return 'heroes';
  } else if (s.endsWith('child')) {
    return s + 'ren';
  } else if (s.match('([^aeiouy]|qu)y$')) {
    return s.slice(0, -1) + 'ies';
  } else if (s.endsWith('f')) {
    return s.slice(0, -1) + 'ves';
  } else if (s.endsWith('ch')) {
    return s + 'es';
  } else if (s.endsWith('us')) {
    return s.slice(0, -2) + 'i';
  } else {
    return s + 's';
  }
};

pq.set_level = function (lvl) {
  pq.character.level = lvl;
  pq.character.xp = lvl * (lvl - 1) * 500;
  pq.character.next = pq.next_level_xp(lvl);
};

pq.set_xp = function (xp) {
  var lvl = 1;
  var next = next_level_xp(1);
  while (xp >= next) {
    lvl += 1;
    next = next_level_xp(1);
  }

  pq.character.level = lvl;
  pq.character.xp = xp;
  pq.character.next = next;
};

pq.gain_xp = function (xp) {
  pq.character.xp += xp;
  var levelup = false;
  while (pq.character.xp >= pq.character.next) {
    levelup = true;
    pq.character.level += 1;
    pq.character.next = pq.next_level_xp(pq.character.level);
  }
  if (levelup) pq.on_level_up();
};

pq.next_level_xp = function (lvl) {
  return (lvl + 1) * lvl * 500;
};

pq.on_level_up = function () {
  $("#log").text("attained level " + pq.character.level + "\n");
};

pq.render_ordinal = function (n) {
  var t = n % 100;
  var o = n % 10;
  if (10 <= t && t <= 20) return n + "th";
  else if (o == 1) return n + "st";
  else if (o == 2) return n + "nd";
  else if (o == 3) return n + "rd";
  else return n + "th";
};

pq.draw_player = function () {
  $("#name").text(pq.character.name);
  $("#level").text(pq.render_ordinal(pq.character.level));
  $("#profession").text(pq.character.profession);
  $("#xp").text(pq.character.xp);
  $("#next").text(pq.character.next);
  $("#gender").text(pq.character.gender);
  $("#pronouns").text(pq.character.pronouns);

  if (pq.character.realm) $("#realm").text(pq.character.realm.name);

  $("#friends").text(pq.character.friends);
  $("#lovers").text(pq.character.lovers);
  $("#twitter").text(pq.character.twitter);
  $("#tumblr").text(pq.character.tumblr);
  $("#patreon").text(pq.character.patreon);

  if (pq.character.weapon) $("#weapon").text(pq.character.weapon.name);

  var slots = pq.character.slots;
  $.each(pq.character.slots, function (slot, o) {
      if (slot in slots) $("#" + slot).text(slots[slot].name);
  });

  if (pq.character.transport) $("#transport").text(pq.character.transport.name);

  $("#inventory").text("");
  _.each(pq.character.pack, function (o) {
      $("#inventory").append("  " + o.name + "\n");
  });
};

pq.pickup = function (o) {
  if (o.kind == "weapon") {
    var old = pq.character.weapon;
    if (old == null || old.bonus < o.bonus) {
      pq.character.weapon = o;
    }
  } else if (o.kind == "armor") {
    var old = pq.character.slots[o.slot];
    if (old == null || old.bonus < o.bonus) {
      pq.character.slots[o.slot] = o;
    }
  } else if (o.kind == "transport") {
    var old = pq.character.transport;
    if (old == null || old.bonus < o.bonus) {
      pq.character.transport = o;
    }
  } else if (pq.character.pack.length < 13) {
    pq.character.pack.push(o);
  } else {
    var i = 0;
    var bonus = pq.character.pack[0].bonus;
    var j = 1;
    while (j < pq.character.pack.length) {
      if (pq.character.pack[j].bonus <= bonus) i = j;
      j += 1
    }
    if (o.bonus > bonus) {
      pq.character.pack[i] = o;
    }
  }
};

pq.coin = function (d) { return Math.random() <= 0.5 };

pq.one_in = function (d) { return pq.die(d) == 1 };

pq.die = function (d) { return Math.floor(Math.random() * d) + 1 };
pq.die0 = function (d) { return Math.floor(Math.random() * d) };

pq.dice = function (n, d) {
  var t = 0
  var i = 0
  while (i < n) { t += pq.die(d); i += 1 }
  return t;
};

pq.dice0 = function (n, d) { return pq.dice(n, d) - n };
pq.choose = function (lst) { return lst[pq.die0(lst.length)] };

pq.generate_bonus = function (lvl) {
  var n = lvl + pq.dice(2, 6);
  var d = pq.dice(2, 6);
  return Math.floor(n / d);
};

// name, kind, slot, bonus

pq.apply_effect = function (name, effect) {
  return effect.replace("_", name);
};

pq.apply_random_effect = function (name, effects) {
  return pq.choose(effects).replace("_", name);
};

pq.generate_object = function (weight) {
  var base = pq.choose(pq.data.objects);

  var name = base.name;
  var kind = base.kind;
  var slot = "slot" in base ? base.slot : null;
  var bonus = pq.generate_bonus(weight);

  if (kind == "weapon") {
    if (weight < 10) {
      var dist = ['normal'];
    } else if (weight < 25) {
      var dist = ['heroic', 'heroic', 'normal']
    } else {
      var dist = ['epic', 'epic', 'heroic', 'normal'];
    }
    if (pq.one_in(2)) {
      name = pq.apply_random_effect(name, pq.data.effects.wprefix[pq.choose(dist)]);
    }
    if (pq.one_in(2)) {
      name = pq.apply_random_effect(name, pq.data.effects.wsuffix[pq.choose(dist)]);
    }
    if (bonus > 0) name += " +" + bonus;
  } else if (kind == "food") {
    if (bonus > 0) name = pq.apply_random_effect(name, pq.data.effects.food);
    if (pq.one_in(3)) name += " (vegan)";

  } else if (kind == "armor") {
    if (bonus > 0) {
      if (bonus > pq.die0(3)) name = pq.apply_random_effect(name, pq.data.effects.armor);
      name += " +" + bonus;
    }

  } else if (kind == "transport") {
    if (bonus > 0) name += " +" + bonus;

  } else if (kind == "item") {
    if (bonus > 0) name += " +" + bonus;

  } else {
    throw "unknown kind " + kind;
  }

  return {"name": name, "kind": kind, "slot": slot, "bonus": bonus};
};

pq.generate_foe = function (weight, lvl) {
  var mlvl = pq.die0(Math.min(lvl + 5, 15));
  var base = pq.choose(pq.data.foes[mlvl]);
  var name = base.name;
  var qty = 1;
  if (mlvl !== lvl) {
    var rlvl = lvl - mlvl;
    if (rlvl > 15) {
      rlvl = pq.die0(20) - 5;
      mlvl = Math.max(mlvl + rlvl, 1);
      qty = Math.floor(lvl / mlvl)
      // hack to reduce group sizes a bit. basic idea:
      //   25%: the previous calculation
      //   25%: sqrt of the previous calculation
      //   50%: only one foe
      if (pq.one_in(2)) qty = 1;
      else if (pq.one_in(2)) qty = Math.ceil(Math.sqrt(qty));
    }

    var rank = pq.choose(pq.data.ranks[rlvl.toString()]);
    if ((rank.startsWith("_-") || rank.startsWith("_/")) && qty > 1) {
      name = pq.pluralize(pq.apply_effect(name, rank))
    } else if (qty > 1) {
      name = pq.apply_effect(pq.pluralize(name), rank)
    } else {
      name = pq.apply_effect(name, rank);
    }
    mlvl = lvl;
  }
  return {"name": name, "lvl": mlvl, "qty": qty};
};

pq.generate_realm = function(lvl) {
  var elvl = pq.ceil_sqrt((lvl-1) * 2);
  elvl = Math.min(elvl, 10);
  var dist = [elvl, elvl, Math.max(elvl-1, 0), Math.max(elvl-2, 0), Math.max(elvl-3, 0)];
  var zone = pq.choose(pq.data.zones[pq.die0(elvl)]);
  var zonemod = pq.choose(pq.data.zonemods[pq.choose(dist)]);
  var name = pq.apply_effect(zone, zonemod);
  if (!zonemod.startsWith('Galt')) {
    name = pq.a(name);
  }
  return {'name': name};
};
