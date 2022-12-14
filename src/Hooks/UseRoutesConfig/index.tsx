import ColumnOrder from '~/Pages/ColumnOrder';
import ColumnVisibility from '~/Pages/ColumnVisibility';
import Editable from '~/Pages/Editable';
import Ellipsis from '~/Pages/Ellipsis';
import ExpandedLine from '~/Pages/ExpandedLine';
import Favorites from '~/Pages/Favorites';
import Filter from '~/Pages/Filter';
import FullEditable from '~/Pages/FullEditable';
import Home from '~/Pages/Home';
import Loading from '~/Pages/Loading';
import Pagination from '~/Pages/Pagination';
import Print from '~/Pages/Print';
import Resizing from '~/Pages/Resizing';
import Selection from '~/Pages/Selection';
import Sort from '~/Pages/Sort';
import Virtualized from '~/Pages/Virtualized';
import Export from '../../Pages/Export';
import { useTranslation } from '../UseTranslation';

export function useRoutesConfig() {
	const { translate } = useTranslation();
	const ROUTES = [
		{ path: '/', element: <Home />, title: translate('HOME') },
		{
			path: '/selection',
			element: <Selection />,
			title: translate('SELECTION'),
		},
		{
			path: '/expanded-line',
			element: <ExpandedLine />,
			title: translate('EXPANDED_LINE'),
		},
		{ path: '/loading', element: <Loading />, title: translate('LOADING') },
		{ path: '/sort', element: <Sort />, title: translate('SORT') },
		{ path: '/filter', element: <Filter />, title: translate('FILTER') },
		{ path: '/editable', element: <Editable />, title: translate('EDITABLE') },
		{ path: '/resizing', element: <Resizing />, title: translate('RESIZING') },
		{
			path: '/full-editable',
			element: <FullEditable />,
			title: translate('FULL_EDITABLE'),
		},
		{
			path: '/virtualized',
			element: <Virtualized />,
			title: translate('VIRTUALIZED'),
		},
		{
			path: '/pagination',
			element: <Pagination />,
			title: translate('PAGINATION'),
		},
		{
			path: '/favorites',
			element: <Favorites />,
			title: translate('FAVORITES'),
		},
		{
			path: '/ellipsis',
			element: <Ellipsis />,
			title: translate('ELLIPSIS'),
		},
		{
			path: '/column-visibility',
			element: <ColumnVisibility />,
			title: translate('COLUMN_VISIBILITY'),
		},
		{
			path: '/column-order',
			element: <ColumnOrder />,
			title: translate('COLUMN_ORDER'),
		},
		{
			path: '/print',
			element: <Print />,
			title: translate('PRINT'),
		},
		{
			path: '/export',
			element: <Export />,
			title: translate('EXPORT'),
		},
	];

	return { ROUTES };
}
