import ReactSelect, { OptionsOrGroups } from 'react-select';

type Props = {
	isClearable?: boolean;
	isDisabled?: boolean;
	isLoading?: boolean;
	isSearchable?: boolean;
	id?: string;
	label?: string;
	placeholder?: string;
	value?: unknown;
	defaultValue?: string;
	options: OptionsOrGroups<unknown, any>;
	onChange?: (data: { target: { id?: string; value: string } }) => void;
	isMulti?: {
		onChange: (data: { target: { id?: string; value: string[] } }) => void;
		value?: string[];
	};

	menuPosition?: 'fixed' | 'absolute';
	menuPortalTarget?: HTMLElement | null;
};

export function SelectNew({
	isClearable,
	isDisabled,
	isLoading,
	isSearchable,
	options,
	id,
	placeholder,
	label,
	value,
	defaultValue,
	onChange,
	isMulti,
	menuPosition,
	menuPortalTarget,
	...rest
}: Props) {
	function handleOnChange(e: unknown) {
		if (!e && onChange) {
			onChange({ target: { value: '', id } });
			return;
		}

		if (isMulti) {
			const dataArray = e as { value: string }[];
			const onlyValue = dataArray.map(item => item.value);
			isMulti.onChange({ target: { value: onlyValue, id } });
		}

		const { value: valueNow } = e as { value: string };
		if (onChange) {
			onChange({ target: { value: valueNow, id } });
		}
	}

	function getValue() {
		if (isMulti) {
			console.log(isMulti.value);
			return options.find(item => item.value === isMulti.value);
		}
		return options.find(item => item.value === value);
	}

	return (
		<div {...rest}>
			{label && (
				<div className="mb-2">
					<label htmlFor={id}>{label}</label>
				</div>
			)}

			<ReactSelect
				isMulti={!!isMulti}
				menuPosition={menuPosition}
				menuPortalTarget={menuPortalTarget}
				loadingMessage={() => 'Carregando...'}
				noOptionsMessage={() => 'Não há dados'}
				key={`react-select-${value}-${label}`}
				id={id}
				className="basic-single"
				classNamePrefix="select"
				defaultValue={options.find(item => item.value === defaultValue)}
				isDisabled={isDisabled}
				isLoading={isLoading}
				isClearable={isClearable}
				isSearchable={isSearchable}
				options={options}
				placeholder={placeholder}
				onChange={handleOnChange}
				value={getValue()}
			/>
		</div>
	);
}
