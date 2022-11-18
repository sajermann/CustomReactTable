import { Route, Routes } from 'react-router-dom';
import ExpandedLine from '../ExpandedLine';
import Home from '../Home';
import Loading from '../Loading';
import Selection from '../Selection';
import { Test } from '../Test';

export default function RoutesConfig() {
	return (
		<Routes>
			<Route path="/" element={<Home />} />
			<Route path="/selection" element={<Selection />} />
			<Route path="/expanded-line" element={<ExpandedLine />} />
			<Route path="/loading" element={<Loading />} />
			<Route path="/test" element={<Test />} />
		</Routes>
	);
}
