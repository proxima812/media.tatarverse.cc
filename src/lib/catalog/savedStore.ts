/**
 * Закладки каталога - только в localStorage: сайт статический, аккаунтов
 * нет. Формат - плоский массив id карточек, тот же прием, что у
 * `catalog:view` в `Catalog.astro`.
 *
 * Единственное место, которое знает ключ и формат хранения: раньше тот же
 * `try/JSON.parse/Array.isArray` был расписан в `SaveButton`, `SavedPage`
 * и `Header` по отдельности. Модуль импортируется из `<script>` компонентов
 * (Astro бандлит такие импорты) и работает только в браузере.
 *
 * `catalog:saved-change` - кастомное событие для остальных потребителей:
 * страница `/saved` и счетчик в шапке не могут держать свое состояние
 * синхронно с localStorage без него, а перезагружать страницу ради снятия
 * одной закладки не нужно.
 */

export const SAVED_KEY = "catalog:saved";

const SAVED_CHANGE_EVENT = "catalog:saved-change";

export function readSaved(): string[] {
	try {
		const raw = localStorage.getItem(SAVED_KEY);
		const parsed = raw ? JSON.parse(raw) : [];
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}

/** Переключает закладку и оповещает подписчиков. Возвращает новое состояние. */
export function toggleSaved(id: string): {
	saved: string[];
	nowSaved: boolean;
} {
	const saved = readSaved();
	const index = saved.indexOf(id);
	const nowSaved = index === -1;
	if (nowSaved) saved.push(id);
	else saved.splice(index, 1);
	localStorage.setItem(SAVED_KEY, JSON.stringify(saved));

	window.dispatchEvent(
		new CustomEvent(SAVED_CHANGE_EVENT, { detail: { id, saved: nowSaved } }),
	);

	return { saved, nowSaved };
}

/** Подписка на изменения закладок в этой вкладке (см. событие выше). */
export function onSavedChange(listener: () => void) {
	window.addEventListener(SAVED_CHANGE_EVENT, listener);
}
