/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef } from 'react';
import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	OnChangeFn,
	Row,
	RowSelectionState,
	useReactTable,
} from '@tanstack/react-table';
import { useVirtualizer as useVirtual } from '@tanstack/react-virtual';
import { Checkbox } from '../Checkbox';

import styles from './index.module.css';

type Props<T> = {
	selection?: {
		type: 'multi' | 'single';
		rowSelection: { [index: number]: boolean };
		setRowSelection: OnChangeFn<RowSelectionState>;
		disableSelectionRow?: (data: Row<T>) => boolean;
	};
	columns: ColumnDef<T>[];
	data: T[];
	isLoading?: boolean;
};

type PropsTableInternal = {
	getIsAllRowsSelected: () => boolean;
	getIsSomeRowsSelected: () => boolean;
};

export function Table<T>({ selection, columns, data, isLoading }: Props<T>) {
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
		if (selection) {
			const t = [
				{
					id: 'select',
					header: ({ table }: any) =>
						selection.type === 'multi' && (
							<Checkbox
								checked={verifyIndeterminate(table)}
								onClick={table.getToggleAllRowsSelectedHandler()}
							/>
						),

					size: 60,
					minSize: 60,
					maxSize: 60,
					align: 'center',
					enableSorting: false,
					cell: ({ row }: any) => (
						<div className="w-full h-full flex items-center justify-center">
							<Checkbox
								{...{
									disabled: selection.disableSelectionRow
										? selection.disableSelectionRow(row)
										: false,
									checked: row.getIsSelected(),
								}}
							/>
						</div>
					),
				},
			];
			return [...t, ...columns];
		}
		return columns;
	}

	const table = useReactTable({
		data,
		columns: buildColumns(),
		columnResizeMode: 'onChange',
		state: {
			sorting: undefined,
			rowSelection: selection?.rowSelection,
		},
		onRowSelectionChange: selection?.setRowSelection,
		enableRowSelection: selection !== undefined,
		enableMultiRowSelection: selection?.type === 'multi',
		onSortingChange: undefined,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	function verifyIsSelected(row: Row<T>, index: number) {
		const classesTemp = [styles.tr];
		if (index % 2 > 0) {
			classesTemp.push(styles.even);
		}
		try {
			if (row.getIsSelected()) {
				classesTemp.push('active');
			}
			return classesTemp.join(' ');
		} catch {
			return classesTemp.join(' ');
		}
	}

	const tableContainerRef = useRef<HTMLDivElement>(null);

	const { rows } = table.getRowModel();
	const rowVirtualizer = useVirtual({
		getScrollElement: () => tableContainerRef.current,
		count: rows.length,
		estimateSize: () => 50,
	});
	const { getVirtualItems, getTotalSize } = rowVirtualizer;

	const paddingTop =
		getVirtualItems().length > 0 ? getVirtualItems()?.[0]?.start || 0 : 0;
	const paddingBottom =
		getVirtualItems().length > 0
			? getTotalSize() -
			  (getVirtualItems()?.[getVirtualItems().length - 1]?.end || 0)
			: 0;

	return (
		<div className="p-2">
			<div
				ref={tableContainerRef}
				className={`${styles.customContainer} scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 scrollbar-thumb-rounded-full scrollbar-track-rounded-full`}
				style={{ overflow: isLoading ? 'hidden' : 'auto' }}
			>
				<table className={styles.table}>
					<thead className={styles.thead}>
						{table.getHeaderGroups().map(headerGroup => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map(header => (
									<th
										className={styles.th}
										key={header.id}
										colSpan={header.colSpan}
										style={{
											width: header.getSize(),
											// @ts-expect-error dasddas
											textAlign: header.getContext().column.columnDef.align,
										}}
									>
										{header.isPlaceholder ? null : (
											<>
												<div
													{...{
														className: header.column.getCanSort()
															? 'cursor-pointer select-none'
															: '',
														onClick: header.column.getToggleSortingHandler(),
													}}
												>
													{flexRender(
														header.column.columnDef.header,
														header.getContext()
													)}
													{{
														asc: ' 🔼',
														desc: ' 🔽',
													}[header.column.getIsSorted() as string] ?? null}
												</div>
												{/* SizingMode */}
												<div
													{...{
														onMouseDown: header.getResizeHandler(),
														onTouchStart: header.getResizeHandler(),
														className: `${styles.resizer} ${
															header.column.getIsResizing()
																? styles.isResizing
																: ''
														}`,
													}}
												/>
											</>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody
						style={{ opacity: isLoading ? 0.5 : 1 }}
						className={styles.tbody}
					>
						{data.length === 0 && !isLoading && (
							<tr style={{ height: '100%' }} className={styles.tr}>
								<td
									colSpan={Object.keys(columns).length}
									className={styles.td}
									style={{ textAlign: 'center' }}
								>
									Sem Dados
								</td>
							</tr>
						)}

						{data.length === 0 && isLoading && (
							<tr style={{ height: '100%' }} className={styles.tr}>
								<td
									colSpan={Object.keys(columns).length}
									className={styles.td}
									style={{ textAlign: 'center' }}
								>
									Carregando...
								</td>
							</tr>
						)}

						{paddingTop > 0 && (
							<tr>
								<td style={{ height: `${paddingTop}px` }} />
							</tr>
						)}
						{getVirtualItems().map(virtualRow => {
							const row = rows[virtualRow.index];
							return (
								<tr
									key={row.id}
									className={verifyIsSelected(row, virtualRow.index)}
									onClick={() => {
										if (!selection) {
											return;
										}
										if (selection?.disableSelectionRow) {
											const result = selection.disableSelectionRow(row);
											if (!result) {
												row.toggleSelected();
											}
										} else {
											row.toggleSelected();
										}
									}}
								>
									{row.getVisibleCells().map(cell => (
										<td
											className={styles.td}
											key={cell.id}
											// @ts-expect-error dasddas
											style={{ textAlign: cell.column.columnDef.align }}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</td>
									))}
								</tr>
							);
						})}
						{paddingBottom > 0 && (
							<tr>
								<td style={{ height: `${paddingBottom}px` }} />
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</div>
	);
}
