/**
 * Мелкие браузерные помощники для `<script>` компонентов. Здесь живет то,
 * что раньше каждый компонент заводил себе заново: запрос reduced-motion
 * и общий обработчик resize.
 */

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

/** Живой MediaQueryList - для подписки на переключение настройки. */
export function reducedMotionQuery(): MediaQueryList {
	return window.matchMedia(REDUCED_MOTION);
}

/** Разовая проверка настройки на момент вызова. */
export function prefersReducedMotion(): boolean {
	return reducedMotionQuery().matches;
}

/*
 * Один слушатель resize на страницу вместо слушателя на каждый компонент.
 * Колбэки собираются в Set и выполняются одним requestAnimationFrame:
 * сколько бы событий ни пришло за кадр, каждый колбэк отработает один раз,
 * и все чтения геометрии лягут в один проход.
 */
const resizeCallbacks = new Set<() => void>();
let resizeFrame = 0;

function flushResize() {
	resizeFrame = 0;
	for (const callback of resizeCallbacks) callback();
}

function scheduleResize() {
	if (resizeFrame === 0) resizeFrame = requestAnimationFrame(flushResize);
}

export function onResize(callback: () => void) {
	if (resizeCallbacks.size === 0) {
		window.addEventListener("resize", scheduleResize);
	}
	resizeCallbacks.add(callback);
}
