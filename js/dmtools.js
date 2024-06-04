"use strict";

const RNG = function (max, exclude) {
	let rtn;
	do {
		rtn = RollerUtil.randomise(max);
	} while (rtn === exclude);

	return rtn;
}

class GeneratorsListManager extends SublistManager {
	static get _ROW_TEMPLATE() {
		return [
			new SublistCellTemplate({
				name: "Name",
				css: "bold ve-col-9 pl-0",
				colStyle: "",
			}),
		];
	}

	pGetSublistItem(it, hash) {
		const cellsText = [it.name];

		const $ele = $(`<div class="lst__row lst__row--sublist ve-flex-col">
			<a href="#${hash}" class="lst--border lst__row-inner">
				${this.constructor._getRowCellsHtml({ values: cellsText })}
			</a>
		</div>`)
			.contextmenu(evt => this._handleSublistItemContextMenu(evt, listItem))
			.click(evt => this._listSub.doSelect(listItem, evt));

		const listItem = new ListItem(
			hash,
			$ele,
			it.name,
			{
				hash,
			},
			{
				entity: it,
				mdRow: [...cellsText],
			},
		);
		return listItem;
	}
}

class DmToolsPage extends ListPage {
	constructor() {
		const pageFilter = new PageFilterGenerators();
		const pFnGetFluff = () => "Encounter Content";

		super({
			dataSource: () => {
				return {
					"object": [
						{ name: "Encounters", template: "encounters", service: new EncounterGen() },
						{ name: "Form of government", template: "tables", service: new SimpleTables(SimpleTables.FORMS_OF_GOVERNMENT, 100) },
						{ name: "World-shaking events", template: "tables", service: new SimpleTables(SimpleTables.WORLD_SHAKING_EVENTS, 10) },
						{ name: "Leader types", template: "tables", service: new SimpleTables(SimpleTables.LEADER_TYPES, 6) },
						{ name: "Cataclysmic disaster", template: "tables", service: new SimpleTables(SimpleTables.CATACLYSMIC_DISASTERS, 10) },
						{ name: "Discoveries", template: "tables", service: new SimpleTables(SimpleTables.DISCOVERIES, 10) },
						{ name: "Extinction or depletion", template: "tables", service: new SimpleTables(SimpleTables.EXTINCTION_OR_DEPLETION, 8) },
						{ name: "Invading forces", template: "tables", service: new SimpleTables(SimpleTables.INVADING_FORCES, 8) },
						{ name: "New organizations", template: "tables", service: new SimpleTables(SimpleTables.NEW_ORGANIZATIONS, 10) },
						{ name: "Astral color pools", template: "tables", service: new SimpleTables(SimpleTables.ASTRAL_COLOR_POOLS, 20) },
						{ name: "Psychic wind location effects", template: "tables", service: new SimpleTables(SimpleTables.PSYCHIC_WIND_LOCATION_EFFECTS, 20) },
						{ name: "Psychic wind mental effects", template: "tables", service: new SimpleTables(SimpleTables.PSYCHIC_WIND_MENTAL_EFFECTS, 20) },
						{ name: "Short-term madness", template: "tables", service: new SimpleTables(SimpleTables.SHORT_TERM_MADNESS, 100) },
						{ name: "Long-term madness", template: "tables", service: new SimpleTables(SimpleTables.LONG_TERM_MADNESS, 100) },
						{ name: "Ethereal curtains", template: "tables", service: new SimpleTables(SimpleTables.ETHEREAL_CURTAINS, 8) },
						{ name: "Ether cyclone", template: "tables", service: new SimpleTables(SimpleTables.ETHER_CYCLONE, 20) },
						{ name: "Feywild time warp", template: "tables", service: new SimpleTables(SimpleTables.FEYWILD_TIME_WARP, 20) },
						{ name: "Shadowfell dispair", template: "tables", service: new SimpleTables(SimpleTables.SHADOWFELL_DESPAIR, 6) },
						{ name: "Abyssal corruption", template: "tables", service: new SimpleTables(SimpleTables.ABYSSAL_CORRUPTION, 10) },
						{ name: "Dungeon goals", template: "tables", service: new SimpleTables(SimpleTables.DUNGEON_GOALS, 20) },
						{ name: "Wilderness goals", template: "tables", service: new SimpleTables(SimpleTables.WILDERNESS_GOALS, 20) },
					]
				}
			},

			pFnGetFluff,

			pageFilter,

			dataProps: ["object"],
		});
	}

	getListItem(obj, obI, isExcluded) {
		this._pageFilter.mutateAndAddToFilters(obj, isExcluded);

		const eleLi = document.createElement("div");
		eleLi.className = `lst__row ve-flex-col ${isExcluded ? "lst__row--blocklisted" : ""}`;

		const hash = UrlUtil.autoEncodeHash(obj);

		eleLi.innerHTML = `<a href="#${hash}" class="lst--border lst__row-inner">
			<span class="bold ve-col-8 pl-0">${obj.name}</span>
		</a>`;

		const listItem = new ListItem(
			obI,
			eleLi,
			obj.name,
			{
				hash,
			},
			{
				isExcluded,
			},
		);

		eleLi.addEventListener("click", (evt) => this._list.doSelect(listItem, evt));
		eleLi.addEventListener("contextmenu", (evt) => this._openContextMenu(evt, this._list, listItem));

		return listItem;
	}

	_tabTitleStats = "Stats";

	_renderStats_doBuildStatsTab({ ent }) {
		const renderStack = [];

		if (ent.entries) this._renderer.recursiveRender({ entries: ent.entries }, renderStack, { depth: 2 });
		if (ent.actionEntries) this._renderer.recursiveRender({ entries: ent.actionEntries }, renderStack, { depth: 2 });

		this._$pgContent.empty().append($(`#${ent.template.toLowerCase()}-template`).html());
		ent.service.Init();
	}

	_renderStats_onTabChangeStats() {
	}

	_renderStats_onTabChangeFluff() {
	}

}

class SimpleTables {
	constructor(table, dice) {
		this._table = table;
		this._dice = dice;
	}

	static get FORMS_OF_GOVERNMENT() {
		return [
			{ result: 'Autocracy', min: 1, max: 8 },
			{ result: 'Bureaucracy', min: 9, max: 13 },
			{ result: 'Confederacy', min: 14, max: 19 },
			{ result: 'Democracy', min: 20, max: 22 },
			{ result: 'Dictatorship', min: 23, max: 27 },
			{ result: 'Feudalism', min: 28, max: 42 },
			{ result: 'Gerontocracy', min: 43, max: 44 },
			{ result: 'Hierarchy', min: 45, max: 53 },
			{ result: 'Magocracy', min: 54, max: 56 },
			{ result: 'Matriarchy', min: 57, max: 58 },
			{ result: 'Militocracy', min: 59, max: 64 },
			{ result: 'Monarchy', min: 65, max: 74 },
			{ result: 'Oligarchy', min: 75, max: 78 },
			{ result: 'Patriarchy', min: 79, max: 80 },
			{ result: 'Meritocracy', min: 81, max: 83 },
			{ result: 'Plutocracy', min: 84, max: 85 },
			{ result: 'Republic', min: 86, max: 92 },
			{ result: 'Satrapy', min: 93, max: 94 },
			{ result: 'Kleptocracy', min: 95 },
			{ result: 'Theocracy', min: 96, max: 100 },
		];
	}

	static get LEADER_TYPES() {
		return [
			{ result: 'Political', min: 1 },
			{ result: 'Religious', min: 2 },
			{ result: 'Military', min: 3 },
			{ result: 'Crime/underworld', min: 4 },
			{ result: 'Art/culture', min: 5 },
			{ result: 'Philosophy/learning/magic', min: 6 },
		];
	}

	static get WORLD_SHAKING_EVENTS() {
		return [
			{ result: () => { return `Rise of a ${GenUtil.getFromTable(SimpleTables.LEADER_TYPES, RNG(6)).result} leader or an era`; }, min: 1 },
			{ result: () => { return `Fall of a ${GenUtil.getFromTable(SimpleTables.LEADER_TYPES, RNG(6)).result} leader or an era`; }, min: 2 },
			{ result: () => { return `Cataclysmic disaster: ${GenUtil.getFromTable(SimpleTables.CATACLYSMIC_DISASTERS, RNG(10)).result}`; }, min: 3 },
			{ result: () => { return `Assault or invasion: ${GenUtil.getFromTable(SimpleTables.INVADING_FORCES, RNG(8)).result}`; }, min: 4 },
			{ result: 'Rebellion, revolution , overthrow', min: 5 },
			{ result: () => { return `Extinction or depletion: ${GenUtil.getFromTable(SimpleTables.EXTINCTION_OR_DEPLETION, RNG(8)).result}`; }, min: 6 },
			{ result: () => { return `New organization: ${GenUtil.getFromTable(SimpleTables.NEW_ORGANIZATIONS, RNG(10)).result}`; }, min: 7 },
			{ result: () => { return `Discovery, expansion, invention: ${GenUtil.getFromTable(SimpleTables.NEW_ORGANIZATIONS, RNG(10)).result}`; }, min: 8 },
			{ result: () => { return `Prediction, omen, prophecy: ${GenUtil.getFromTable(SimpleTables.WORLD_SHAKING_EVENTS, RNG(8)).result}`; }, min: 9 },
			{ result: () => { return `Myth and legend: ${GenUtil.getFromTable(SimpleTables.WORLD_SHAKING_EVENTS, RNG(8)).result}`; }, min: 10 },
		];
	}

	static get CATACLYSMIC_DISASTERS() {
		return [
			{ result: 'Earthquake', min: 1 },
			{ result: 'Famine/drought', min: 2 },
			{ result: 'Fire', min: 3 },
			{ result: 'Flood', min: 4 },
			{ result: 'Plague/disease', min: 5 },
			{ result: 'Rain of fire (meteoric impact)', min: 6 },
			{ result: 'Storm (hurricane, tornado, tsunami)', min: 7 },
			{ result: 'Volcanic eruption', min: 8 },
			{ result: 'Magic gone awry or a planar warp', min: 9 },
			{ result: 'Divine judgment', min: 10 },
		];
	}

	static get INVADING_FORCES() {
		return [
			{ result: 'A criminal enterprise', min: 1 },
			{ result: 'Monsters or a unique monster', min: 2 },
			{ result: 'A planar threat', min: 3 },
			{ result: 'A past adversary reawakened, reborn, or resurgent', min: 4 },
			{ result: 'A splinter faction', min: 5 },
			{ result: 'A savage tribe', min: 6 },
			{ result: 'A secret society', min: 7 },
			{ result: 'A traitorous ally', min: 8 },
		];
	}

	static get EXTINCTION_OR_DEPLETION() {
		return [
			{ result: 'A kind of animal (insect, bird, fish, livestock)', min: 1 },
			{ result: 'Habitable land', min: 2 },
			{ result: 'Magic or magic-users (all magic, or specific kinds or schools of magic)', min: 3 },
			{ result: 'A mineral resource (gems, metals, ores)', min: 4 },
			{ result: 'A type of monster (unicorn, manticore, dragon)', min: 5 },
			{ result: 'A people (family line, clan, culture, race)', min: 6 },
			{ result: 'A kind of plant (crop, tree, herb, forest)', min: 7 },
			{ result: 'A waterway (river, lake, ocean)', min: 8 },
		];
	}

	static get NEW_ORGANIZATIONS() {
		return [
			{ result: 'Crime syndicate/bandit confederacy', min: 1 },
			{ result: 'Guild (masons, apothecaries, goldsmiths)', min: 2 },
			{ result: 'Magical circlefsociety', min: 3 },
			{ result: 'Military/knightly order', min: 4 },
			{ result: 'New family dynasty/tribe/clan', min: 5 },
			{ result: 'Philosophy/discipline dedicated to a principle or ideal', min: 6 },
			{ result: 'Realm (village, town, duchy, kingdom)', min: 7 },
			{ result: 'Religion/sect/denomination', min: 8 },
			{ result: 'School/university', min: 9 },
			{ result: 'Secret society/cult/cabal', min: 10 },
		];
	}

	static get DISCOVERIES() {
		return [
			{ result: 'Ancient ruinflost city of a legendary race', min: 1 },
			{ result: 'Animal/monster/magical mutation', min: 2 },
			{ result: 'lnvention/technology/magic (helpful, destructive)', min: 3 },
			{ result: 'New (or forgotten) god or planar entity', min: 4 },
			{ result: 'New (or rediscovered) artifact or religious relic', min: 5 },
			{ result: 'New land (island, continent, lost world , demiplane)', min: 6 },
			{ result: 'Otherworldly object (planar portal, alien spacecraft)', min: 7 },
			{ result: 'People (race, tribe, lost civilization , colony)', min: 8 },
			{ result: 'Plant (miracle herb, fungal parasite, sentient plant)', min: 9 },
			{ result: 'Resource or wealth (gold, gems, mithral)', min: 10 },
		];
	}

	static get ASTRAL_COLOR_POOLS() {
		return [
			{ result: 'Ysgard - Indigo', min: 1 },
			{ result: 'Limbo - jet black', min: 2 },
			{ result: 'Pandemonium - Magenta', min: 3 },
			{ result: 'The Abyss - Amethyst', min: 4 },
			{ result: 'Carceri - Olive', min: 5 },
			{ result: 'Hades - Rust', min: 6 },
			{ result: 'Gehenna - Russet', min: 7 },
			{ result: 'The Nine Hells - Ruby', min: 8 },
			{ result: 'Acheron - Flame red ', min: 9 },
			{ result: 'Mechanus Diamond - blue', min: 10 },
			{ result: 'Arcadia - Saffron', min: 11 },
			{ result: 'Mount Celestia - Gold ', min: 12 },
			{ result: 'Bytopia - Amber', min: 13 },
			{ result: 'Elysium - Orange ', min: 14 },
			{ result: 'The Beastlands - Emerald green', min: 15 },
			{ result: 'Arborea - Sapphire blue', min: 16 },
			{ result: 'The Outlands - Leather brown', min: 17 },
			{ result: 'Ethereal Plane - Spiraling white', min: 18 },
			{ result: 'Material Plane - Silver', min: 19, max: 20 },
		];
	}

	static get PSYCHIC_WIND_LOCATION_EFFECTS() {
		return [
			{ result: () => { return `Diverted; add 1d6 = ${RNG(6)} hours to travel time`; }, min: 1, max: 8 },
			{ result: () => { return `Blown off course; add 3d10 = ${RNG(10) + RNG(10) + RNG(10)} hours to travel time`; }, min: 9, max: 12 },
			{ result: 'Lost; at the end of the travel time, characters arrive at a location other than the intended destination', min: 13, max: 16 },
			{ result: () => { return `Sent through color pool to a random plane: ${GenUtil.getFromTable(SimpleTables.ASTRAL_COLOR_POOLS, RNG(20)).result}`; }, min: 17, max: 20 },
		];
	}

	static get PSYCHIC_WIND_MENTAL_EFFECTS() {
		return [
			{ result: 'Stunned for 1 minute; you can repeat the saving throw at the end of each of your turns to end the effect on yourself', min: 1, max: 8 },
			{ result: () => { return 'Short-term madness: ' + GenUtil.getFromTable(SimpleTables.SHORT_TERM_MADNESS, RNG(100)).result }, min: 9, max: 10 },
			{ result: () => { return `11 (2d10) = ${RNG(10) + RNG(10)} psychic damage`; }, min: 11, max: 12 },
			{ result: () => { return `22 (4d10)= ${RNG(10) + RNG(10) + RNG(10) + RNG(10)}  psychic damage`; }, min: 13, max: 16 },
			{ result: () => { return 'Long-term madness: ' + GenUtil.getFromTable(SimpleTables.LONG_TERM_MADNESS, RNG(100)).result }, min: 17, max: 18 },
			{ result: () => { return `Unconscious for 5 (1d10) = ${RNG(10)} minutes; the effect on you ends if you take damage or if another creature uses an action to shake you awakee`; }, min: 19, max: 20 },
		];
	}

	static get ETHEREAL_CURTAINS() {
		return [
			{ min: 1, result: 'Material Plane - Bright turquoise' },
			{ min: 2, result: 'Shadowfell - Dusky gray' },
			{ min: 3, result: 'Feywild - Opalescent white' },
			{ min: 4, result: 'Plane of Air - Pale blue' },
			{ min: 5, result: 'Plane of Earth - Reddish-brown' },
			{ min: 6, result: 'Plane of Fire - Orange' },
			{ min: 7, result: 'Plane of Water - Green' },
			{ min: 8, result: 'Elemental Chaos - Swirling mix of colors ' },
		];
	}

	static get ETHER_CYCLONE() {
		return [
			{ result: 'Extended journey.', min: 1, max: 12 },
			{ result: () => { return 'Blown to the Border Ethereal of a random plane: ' + GenUtil.getFromTable(SimpleTables.ETHEREAL_CURTAINS, RNG(8)).result }, min: 13, max: 19 },
			{ result: 'Hurled into the Astral Plane.', min: 20 },
		];
	}

	static get FEYWILD_TIME_WARP() {
		return [
			{ result: 'Days become minutes.', min: 1, max: 2 },
			{ result: 'Days become hours.', min: 3, max: 6 },
			{ result: 'No change.', min: 7, max: 13 },
			{ result: 'Days become weeks.', min: 14, max: 17 },
			{ result: 'Days become months.', min: 18, max: 19 },
			{ result: 'Days become years.', min: 20, },
		];
	}

	static get SHADOWFELL_DESPAIR() {
		return [
			{ min: 1, max: 3, result: `Apathy. The character has disadvantage on death saving throws and on Dexterity checks for initiative, and gains the following flaw: "I don't believe I can make a difference to anyone or anything."` },
			{ min: 4, max: 5, result: `Dread. The character has disadvantage on all saving throws and gains the following flaw: "I am convinced that this place is going to kill me."` },
			{ min: 6, result: `Madness. The character has disadvantage on ability checks and saving throws that use Intelligence, Wisdom, or Charisma, and gains the following flaw: "I can't tell what's real anymore."` },
		];
	}

	static get ABYSSAL_CORRUPTION() {
		return [
			{ min: 1, max: 4, result: `Treachery. The character gains the following flaw: "I can only achieve my goals by making sure that my companions don't achieve theirs."` },
			{ min: 5, max: 7, result: `Bloodlust. The character gains the following flaw: " I enjoy killin g for its own sake, and once I start, it's hard to stop."` },
			{ min: 8, max: 9, result: `Mad Ambition. The character gains the following flaw: " I am destined to rule the Abyss, and my companions are tools to that end."` },
			{
				min: 10, max: 10, result: `Demonic Possession. The character is possessed by a demonic entity until freed by dispel evil and good or similar magic.
			Whenever the possessed character rolls a 1 on an attack roll, ability check, or saving throw, the demon takes control of the character and determines the character's behavior.
			At the end of each of the possessed character's turns, he or she can make a DC 15 Charisma saving throw. On a success, the character regains control until he or she rolls another 1.` },
		];
	}

	static get DUNGEON_GOALS() {
		return [
			{ min: 1, result: `Stop the dungeon's monstrous inhabitants from raiding the surface world.` },
			{ min: 2, result: `Foil a villain's evil scheme.` },
			{ min: 3, result: `Destroy a magical threat inside the dungeon.` },
			{ min: 4, result: `Acquire treasure.` },
			{ min: 5, result: `Find a particular item for a specific purpose.` },
			{ min: 6, result: `Retrieve a stolen item hidden in the dungeon.` },
			{ min: 7, result: `Find information needed for a special purpose.` },
			{ min: 8, result: `Rescue a captive.` },
			{ min: 9, result: `Discover the fate of a previous adventuring party.` },
			{ min: 10, result: `Find an NPC who disappeared in the area.` },
			{ min: 11, result: `Slay a dragon or some other challenging monster.` },
			{ min: 12, result: `Discover the nature and origin of a strange location or phenomenon.` },
			{ min: 13, result: `Pursue fleeing foes taking refuge in the dungeon.` },
			{ min: 14, result: `Escape from captivity in the dungeon.` },
			{ min: 15, result: `Clear a ruin so it can be rebuilt and reoccupied.` },
			{ min: 16, result: `Discover why a villain is interested in the dungeon.` },
			{ min: 17, result: `Win a bet or complete a rite of passage by surviving in the dungeon for a certain amount oftime.` },
			{ min: 18, result: `Parley with a villain in the dungeon.` },
			{ min: 19, result: `Hide from a threat outside the dungeon.` },
			{
				min: 20, result: () => {
					let rng1 = RNG(19);
					let rng2 = RNG(19, rng1);
					return `${GenUtil.getFromTable(SimpleTables.DUNGEON_GOALS, rng1).result} & ${GenUtil.getFromTable(SimpleTables.DUNGEON_GOALS, rng2).result}`;
				}
			},
		];
	}

	static get WILDERNESS_GOALS() {
		return [
			{ min: 1, result: () => { return `Locate a dungeon or other site of interest: ${GenUtil.getFromTable(SimpleTables.DUNGEON_GOALS, RNG(20)).result}` } },
			{ min: 2, result: `Assess the scope of a natural or unnatural disaster.` },
			{ min: 3, result: `Escort an NPC to a destination .` },
			{ min: 4, result: `Arrive at a destination without being seen by the villain's forces.` },
			{ min: 5, result: `Stop monsters from raiding caravans and farms.` },
			{ min: 6, result: `Establish trade with a distant town.` },
			{ min: 7, result: `Protect a caravan traveling to a distant town.` },
			{ min: 8, result: `Map a new land.` },
			{ min: 9, result: `Find a place to establish a colony.` },
			{ min: 10, result: `Find a natural resource.` },
			{ min: 11, result: `Hunt a specific monster.` },
			{ min: 12, result: `Return home from a distant place.` },
			{ min: 13, result: `Obtain information from a reclusive hermit.` },
			{ min: 14, result: `Find an object that was lost in the wilds.` },
			{ min: 15, result: `Discover the fate of a missing group of explorers.` },
			{ min: 16, result: `Pursue fleeing foes.` },
			{ min: 17, result: `Assess the size of an approaching army.` },
			{ min: 18, result: `Escape the re ign of a tyrant.` },
			{ min: 19, result: `Protect a wilderness site from attackers.` },
			{
				min: 20, result: () => {
					let rng1 = RNG(19);
					let rng2 = RNG(19, rng1);
					return `${GenUtil.getFromTable(SimpleTables.WILDERNESS_GOALS, rng1).result} & ${GenUtil.getFromTable(SimpleTables.WILDERNESS_GOALS, rng2).result}`;
				}
			},
		];
	}

	static get LONG_TERM_MADNESS() {
		return [
			{ result: 'The character feels compelled to repeat a specific activity over and over, such as washing hands, touching things, praying, or counting coins.', min: 1, max: 10 },
			{ result: 'The character experiences vivid hallucinations and has disadvantage on ability checks.', min: 11, max: 20 },
			{ result: 'The character suffers extreme paranoia. The character has disadvantage on Wisdom and Charisma checks.', min: 21, max: 30 },
			{ result: 'The character regards something (usually the source of madness) with intense revulsion, as if affected by the antipathy effect of the antipathy/sympathy spell.', min: 31, max: 40 },
			{ result: 'The character experiences a powerful delusion. Choose a potion. The character imagines that he or she is under its effects.', min: 41, max: 45 },
			{ result: 'The character becomes attached to a "lucky charm", such as a person or an object, and has disadvantage on attack rolls, ability checks, and saving throws while more than 30 feet from it.', min: 46, max: 55 },
			{ result: () => { return 'The character is blinded (25%) or deafened (75%): ' + (RNG(4) == 1 ? 'blinded' : 'defeaned'); }, min: 56, max: 65 },
			{ result: 'The character experiences uncontrollable tremors or tics, which impose disadvantage on attack rolls, ability checks, and saving throws that involve Strength or Dexterity.', min: 66, max: 75 },
			{ result: `The character suffers from partial amnesia. The character knows who he or she is and retains racial traits and class features, but doesn't recognize other people or remember anything that happened before the madness took effect.`, min: 76, max: 85 },
			{ result: `Whenever the character takes damage, he or she must succeed on a DC 15 Wisdom saving throw or be affected as though he or she failed a saving throw against the confusion spell. The confusion effect lasts for 1 minute.`, min: 86, max: 90 },
			{ result: `The character loses the ability to speak.`, min: 91, max: 95 },
			{ result: `The character falls unconscious. No amount of jostling or damage can wake the character.`, min: 96, max: 100 },
		];
	}

	static get SHORT_TERM_MADNESS() {
		return [
			{ result: 'The character retreats into his or her mind and becomes paralyzed . The effect ends if the character takes any damage.', min: 1, max: 20 },
			{ result: 'The character becomes incapacitated and spends the duration screaming, laughing, or weeping.', min: 21, max: 30 },
			{ result: 'The character becomes frightened and must use his or her action and movement each round to flee from the source of the fear.', min: 31, max: 40 },
			{ result: 'The character begins babbling and is incapable of normal speech or spellcasting.', min: 41, max: 50 },
			{ result: 'The character must use his or her action each round to attack the nearest creature.', min: 51, max: 60 },
			{ result: 'The character experiences vivid hallucinations and has disadvantage on ability checks.', min: 61, max: 70 },
			{ result: `The character does whatever anyone tells him or her to do that isn't obviously self-destructive.`, min: 71, max: 75 },
			{ result: 'The character experiences an overpowering urge to eat something strange such as dirt, slime, or offal.', min: 76, max: 80 },
			{ result: `The character is stunned.`, min: 81, max: 90 },
			{ result: `The character falls unconscious.`, min: 91, max: 100 },
		];
	}

	Init() {
		$('.generator-wrapper .btn-generate')[0].addEventListener('click', this._generate.bind(this));
	}

	_generate() {
		$('#table-results').text(GenUtil.getFromTable(this._table, RNG(this._dice)).result);
	}
}

class EncounterGen {

	static get ENCOUNTER_TYPE() {
		return [
			{ result: 'Local Faction Leader (2)', min: 2 },
			{ result: 'Travelling NPCs (3)', min: 3 },
			{ result: 'Outside Faction (4-5)', min: 4, max: 5 },
			{ result: 'Local Faction (6-7)', min: 6, max: 7 },
			{ result: 'Local Beasts (8-9)', min: 8, max: 9 },
			{ result: 'Outside Beasts (10-11-12)', min: 10, max: 12 },
		];
	}

	static get ENCOUNTER_DISTANCE() {
		return [
			{ result: 'Searching for PCs / High Alert (1)', min: 1 },
			{ result: 'Fighting something else / High Alert (2)', min: 2 },
			{ result: 'Searching for something else / High Alert (3)', min: 3 },
			{ result: 'Undertaking task / Medium alert (4)', min: 4 },
			{ result: 'Returning from task / Low alert (5)', min: 5 },
			{ result: 'Resting / Low alert (6)', min: 6 },
		];
	}

	static get ENCOUNTER_ALERTNESS() {
		return [
			{ result: 'Surprise / Ambush (1)', min: 1 },
			{ result: 'Nearby / Charging distance (2)', min: 2 },
			{ result: 'Not Far / Bow range (3)', min: 3 },
			{ result: 'Far / Outside bow range (4)', min: 4 },
			{ result: 'Sign and traces (5)', min: 5 },
			{ result: 'Retreating / Injured (6)', min: 6 },
		];
	}

	Init() {
		$('.generator-wrapper .btn-generate')[0].addEventListener('click', this._generate.bind(this));
	}

	_generate() {
		let d6Alertness = RNG(6);
		let d6Distance = RNG(6);
		let alertness = GenUtil.getFromTable(EncounterGen.ENCOUNTER_ALERTNESS, d6Alertness);
		let distance = GenUtil.getFromTable(EncounterGen.ENCOUNTER_DISTANCE, d6Distance);
		let type = GenUtil.getFromTable(EncounterGen.ENCOUNTER_TYPE, d6Alertness + d6Distance);

		$('#encounter-results').text(`${type.result} - ${alertness.result} - ${distance.result}`);
	}
}

const dmToolsPage = new DmToolsPage();
dmToolsPage.sublistManager = new GeneratorsListManager();
window.addEventListener("load", () => dmToolsPage.pOnLoad());
