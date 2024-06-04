"use strict";

class PageFilterGenerators extends PageFilter {
	constructor () {
		super();
	}
	
	static mutateForFilters (obj) {
	}

	addToFilters (obj, isExcluded) {
		if (isExcluded) return;

		this._sourceFilter.addItem(obj.source);
	}

	async _pPopulateBoxOptions (opts) {
		opts.filters = [
			this._sourceFilter,
		];
	}

	toDisplay (values, obj) {
		return this._filterBox.toDisplay(
			values,
			obj.source,
		);
	}
}

globalThis.PageFilterGenerators = PageFilterGenerators;
