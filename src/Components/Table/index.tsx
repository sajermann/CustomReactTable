/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
	Dispatch,
	SetStateAction,
	useEffect,
	useMemo,
	useRef,
	useState,
} from 'react';
import {
	CellContext,
	ColumnDef,
	FilterFn,
	getCoreRowModel,
	getExpandedRowModel,
	getSortedRowModel,
	HeaderContext,
	OnChangeFn,
	Row,
	RowSelectionState,
	SortingFn,
	SortingState,
	useReactTable,
	sortingFns,
	getFilteredRowModel,
	PaginationState,
	TableMeta,
} from '@tanstack/react-table';
import {
	RankingInfo,
	rankItem,
	compareItems,
} from '@tanstack/match-sorter-utils';
import { Checkbox } from '../Checkbox';

import styles from './index.module.css';
import { useTranslation } from '../../Hooks/UseTranslation';
import { Thead } from './Thead';
import { Tbody } from './Tbody';
import { Pagination } from './Pagination';

// Page Count = Quantity Pages
// Page Size = Quantity Items per Page

type Props<T> = {
	selection?: {
		type: 'multi' | 'single';
		rowSelection: { [index: number]: boolean };
		setRowSelection: OnChangeFn<RowSelectionState>;
		disableSelectionRow?: (data: Row<T>) => boolean;
		disableCheckbox?: boolean;
	};

	columns: ColumnDef<T, unknown>[];
	data: T[];
	isLoading?: boolean;
	expandLine?: {
		render: (data: Row<T>) => React.ReactNode;
	};

	globalFilter?: {
		filter: string;
		setFilter: (data: string) => void;
	};

	rowForUpdate?: { row: number; data: T } | null;
	disabledVirtualization?: boolean;

	enablePagination?: {
		pageCount: number;
		pageIndex: number;
		pageSize: number;
		setPagination: Dispatch<
			SetStateAction<{
				pageIndex: number;
				pageSize: number;
			}>
		>;
	};

	meta?: TableMeta<T>;
	defaultColumn?: Partial<ColumnDef<T, unknown>>;
};

type PropsTableInternal = {
	getIsAllRowsSelected: () => boolean;
	getIsSomeRowsSelected: () => boolean;
};

export function Table<T>({
	selection,
	columns,
	data,
	isLoading,
	expandLine,
	globalFilter,
	rowForUpdate,
	disabledVirtualization,
	enablePagination,
	meta,
	defaultColumn,
}: Props<T>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	// const [pagination, setPagination] = useState({
	// 	pageIndex: 0,
	// 	pageSize: 50,
	// });

	// const paginationConfig = {
	// 	pageIndex: pagination.pageIndex || 0,
	// 	pageSize: pagination.pageSize || 0,
	// };

	// useEffect(() => {
	// 	enablePagination?.onChange(pagination);
	// }, [pagination]);

	const { translate } = useTranslation();

	function verifyIndeterminate(table: PropsTableInternal) {
		if (table.getIsAllRowsSelected()) {
			return true;
		}

		if (table.getIsSomeRowsSelected()) {
			return 'indeterminate';
		}

		return false;
	}

	function buildColumns() {
		const result: ColumnDef<T, unknown>[] = [];

		if (selection && !selection.disableCheckbox) {
			const t = [
				{
					id: 'select',
					header: ({ table }: HeaderContext<T, unknown>) =>
						selection.type === 'multi' && (
							<Checkbox
								containerProps={{
									className: 'flex items-center justify-center',
								}}
								checked={verifyIndeterminate(table)}
								onClick={table.getToggleAllRowsSelectedHandler()}
								{...{ disabled: selection.disableSelectionRow !== undefined }}
							/>
						),
					size: 60,
					minSize: 60,
					maxSize: 60,
					align: 'center',
					enableSorting: false,
					cell: ({ row }: CellContext<T, unknown>) => (
						<Checkbox
							containerProps={{
								className: 'flex items-center justify-center',
							}}
							{...{
								disabled: selection.disableSelectionRow
									? selection.disableSelectionRow(row)
									: false,
								checked: row.getIsSelected(),
							}}
						/>
					),
				},
			];
			result.push(t as unknown as ColumnDef<T, unknown>);
		}

		if (expandLine) {
			const t = [
				{
					id: 'expander',
					header: translate('ACTION'),
					size: 10,
					cell: ({ row }: CellContext<T, unknown>) => (
						<button
							type="button"
							onClick={row.getToggleExpandedHandler()}
							{...{
								style: { cursor: 'pointer' },
							}}
						>
							{row.getIsExpanded() ? '✏' : '📝'}
						</button>
					),
				},
			];
			result.push(t as unknown as ColumnDef<T, unknown>);
		}

		result.push(columns as unknown as ColumnDef<T, unknown>);
		return result.flat();
	}

	const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
		console.log({ row, columnId, value, addMeta });
		// Rank the item
		const itemRank = rankItem(row.getValue(columnId), value);

		// Store the itemRank info
		addMeta({
			itemRank,
		});

		// Return if the item should be filtered in/out
		return itemRank.passed;
	};

	const table = useReactTable({
		data,
		columns: buildColumns(),
		defaultColumn,
		getCoreRowModel: getCoreRowModel(),
		columnResizeMode: 'onChange',
		// filterFns: {
		// 	fuzzy: fuzzyFilter,
		// },
		// globalFilterFn: fuzzyFilter,
		getFilteredRowModel: getFilteredRowModel(),
		pageCount: enablePagination?.pageCount,
		state: {
			pagination: {
				pageIndex: enablePagination?.pageIndex || 0,
				pageSize: enablePagination?.pageSize || 0,
			},
			sorting,
			rowSelection: selection?.rowSelection,
			globalFilter: globalFilter?.filter,
		},
		onGlobalFilterChange: globalFilter?.setFilter,
		onRowSelectionChange: selection?.setRowSelection,
		enableRowSelection: selection !== undefined,
		enableMultiRowSelection: selection?.type === 'multi',
		onSortingChange: setSorting,

		getSortedRowModel: getSortedRowModel(),
		getRowCanExpand: () => !!expandLine,
		getExpandedRowModel: getExpandedRowModel(),
		manualPagination: true,
		onPaginationChange: enablePagination?.setPagination,
		meta,
	});

	const tableContainerRef = useRef<HTMLDivElement>(null);

	return (
		<div className="p-2">
			<div
				ref={tableContainerRef}
				className={`${styles.customContainer} scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full`}
				style={{ overflow: isLoading ? 'hidden' : 'auto' }}
			>
				<table className={styles.table}>
					<Thead table={table} />

					<Tbody
						table={table}
						tableContainerRef={tableContainerRef}
						data={data}
						columns={columns}
						isLoading={isLoading}
						expandLine={expandLine}
						selection={selection}
						rowForUpdate={rowForUpdate}
						disabledVirtualization={disabledVirtualization}
					/>
				</table>
				{enablePagination && <Pagination table={table} />}
			</div>
		</div>
	);
}
