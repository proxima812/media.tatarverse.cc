/**
 * Подписчики, которых благодарит блок `InstFollows` на главной. Список ручной
 * и короткий: в две строки помещается двадцать хендлов, а длинный перечень
 * пришлось бы резать в компоненте - здесь же видно ровно то, что попадет на
 * страницу. Порядок = порядок в строках, первая половина - верхняя строка.
 */
export interface Follower {
	handle: string;
	name?: string;
}

export const followers: Follower[] = [
	{ handle: "@altyn.urda", name: "Altyn.Urda" },
	{ handle: "@tatar.mosaics", name: "Tatar Leather Mosaics" },
	{ handle: "@tartarrica", name: "Ilzirә" },
	{ handle: "@torikbodin", name: "török bodın" },
	{ handle: "@bulat.shams", name: "Bulat Shams | illustrator • designer" },
	{ handle: "@kursainov", name: "Нури Курсаинов" },
	{ handle: "@gumus.sozluk", name: "Къарачай-малкъар/Татарстан" },
	{ handle: "@const_proxima", name: "Камиль М · Kamil M" },
	{ handle: "@mr_beart", name: "Beart" },
	{ handle: "@xrenat", name: "Renat Khabibulin" },
	{ handle: "@tatary_almaty", name: "Татары Алматы" },
	{ handle: "@volga_ural_tatar", name: "Тюрко-татарский мир" },
	{ handle: "@ilnur.mirikhan", name: "Ильнур Мирихан" },
	{ handle: "@tatarstan.kz", name: "Полпредство РТ в Казахстане" },
	{ handle: "@nv_notes", name: "Наиль" },
	{ handle: "@djin_grin", name: "Djin Green" },
	{ handle: "@silkwaykzn", name: "СУВЕНИРЫ И ПОДАРКИ ИЗ КАЗАНИ" },
	{ handle: "@tatartalkbot", name: "Tataro" },
	{ handle: "@malina.visual", name: "Алина Малина | просто это красиво" },
	{ handle: "@lilyrouz", name: "Альфия Сагитова" },
];
