import { createContext, PropsWithChildren, useContext } from 'react';
import {
	ExplorerItem,
	FilePath,
	NonIndexedPathItem,
	Object,
	useItemsAsEphemeralPaths,
	useItemsAsFilePaths,
	useItemsAsObjects,
	useExplorerStore
} from '@sd/client';
import { NonEmptyArray } from '~/util';
import { useParams, useLocation } from 'react-router-dom';

const ContextMenuContext = createContext<{
	selectedItems: NonEmptyArray<ExplorerItem>;
	selectedFilePaths: FilePath[];
	selectedObjects: Object[];
	selectedEphemeralPaths: NonIndexedPathItem[];
	locationId?: number;
	path?: string;
} | null>(null);

export const ContextMenuContextProvider = ({
	selectedItems,
	children
}: PropsWithChildren<{
	selectedItems: NonEmptyArray<ExplorerItem>;
}>) => {
	const selectedFilePaths = useItemsAsFilePaths(selectedItems);
	const selectedObjects = useItemsAsObjects(selectedItems);
	const selectedEphemeralPaths = useItemsAsEphemeralPaths(selectedItems);
	const { libraryId } = useParams();
	const location = useLocation();
	const activeLocationId = useExplorerStore((s) => s.activeLocationId);

	// Get current path from URL
	const searchParams = new URLSearchParams(location.search);
	const currentPath = searchParams.get('path') || '/';

	return (
		<ContextMenuContext.Provider
			value={{
				selectedItems,
				selectedFilePaths,
				selectedObjects,
				selectedEphemeralPaths,
				locationId: activeLocationId ? Number(activeLocationId) : undefined,
				path: currentPath
			}}
		>
			{children}
		</ContextMenuContext.Provider>
	);
};

export const useContextMenuContext = () => {
	const context = useContext(ContextMenuContext);
	if (!context) throw new Error('ContextMenuContext.Provider not found');
	return context;
};
