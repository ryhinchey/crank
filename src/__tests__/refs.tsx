/** @jsx createElement */
import {Context, createElement, Element, Fragment} from "../index";
import {renderer} from "../dom";

// TODO: write generative tests for this stuff
describe("keys", () => {
	afterEach(() => {
		document.body.innerHTML = "";
		renderer.render(null, document.body);
	});

	test("basic", () => {
		const fn = jest.fn();
		renderer.render(<div crank-ref={fn}>Hello</div>, document.body);

		expect(document.body.innerHTML).toEqual("<div>Hello</div>");
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(document.body.firstChild);
	});

	test("child", () => {
		const fn = jest.fn();
		renderer.render(
			<div>
				<span crank-ref={fn}>Hello</span>
			</div>,
			document.body,
		);

		expect(document.body.innerHTML).toEqual("<div><span>Hello</span></div>");
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(document.body.firstChild!.firstChild);
	});

	test("fragment", () => {
		const fn = jest.fn();
		renderer.render(
			<div>
				<Fragment crank-ref={fn}>
					<span>1</span>
					<span>2</span>
					<span>3</span>
				</Fragment>
			</div>,
			document.body,
		);

		expect(document.body.innerHTML).toEqual(
			"<div><span>1</span><span>2</span><span>3</span></div>",
		);
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(
			Array.from(document.body.firstChild!.childNodes),
		);
	});

	test("function", () => {
		const fn = jest.fn();
		function Component(): Element {
			return <span>Hello</span>;
		}

		renderer.render(
			<div>
				<Component crank-ref={fn} />
			</div>,
			document.body,
		);

		expect(document.body.innerHTML).toEqual("<div><span>Hello</span></div>");
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(document.body.firstChild!.firstChild);
	});

	test("generator", () => {
		const fn = jest.fn();
		function* Component(): Generator<Element> {
			while (true) {
				yield <span>Hello</span>;
			}
		}

		renderer.render(
			<div>
				<Component crank-ref={fn} />
			</div>,
			document.body,
		);

		expect(document.body.innerHTML).toEqual("<div><span>Hello</span></div>");
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(document.body.firstChild!.firstChild);
	});

	test("async function", async () => {
		const fn = jest.fn();
		async function Component(): Promise<Element> {
			return <span>Hello</span>;
		}

		await renderer.render(
			<div>
				<Component crank-ref={fn} />
			</div>,
			document.body,
		);

		expect(document.body.innerHTML).toEqual("<div><span>Hello</span></div>");
		expect(fn).toHaveBeenCalledTimes(1);
		expect(fn).toHaveBeenCalledWith(document.body.firstChild!.firstChild);
	});

	test("async generator", async () => {
		const fn = jest.fn();
		async function* Component(this: Context): AsyncGenerator<Element> {
			for await (const _ of this) {
				yield <span>Hello</span>;
			}
		}

		await renderer.render(
			<div>
				<Component crank-ref={fn} />
			</div>,
			document.body,
		);

		expect(document.body.innerHTML).toEqual("<div><span>Hello</span></div>");
		// TODO: this should be 1 when we figure out async generators
		expect(fn).toHaveBeenCalledTimes(2);
		expect(fn).toHaveBeenCalledWith(document.body.firstChild!.firstChild);
	});
});