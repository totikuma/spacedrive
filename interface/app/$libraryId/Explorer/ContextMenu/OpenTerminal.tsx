import { Terminal } from '@phosphor-icons/react';
import { useMemo } from 'react';
import { useLocation } from 'react-router';
import { explorerStore } from '@sd/client';
import { ContextMenu } from '@sd/ui';
import { useLocale } from '~/hooks';
import { usePlatform } from '~/util/Platform';

export default function OpenTerminal() {
	const location = useLocation();
	const { openTerminal } = usePlatform();
	const { t } = useLocale();

	// Webプラットフォームでは無効
	if (!openTerminal) return null;

	// ファイルブラウザで現在のパスを取得
	const currentPath = useMemo(() => {
		const params = new URLSearchParams(location.search);
		return params.get('path') || '/';
	}, [location.search]);

	// 現在のロケーションのフルパスを取得
	const currentFullPath = useMemo(() => {
		const activeLocationId = explorerStore.getState().activeLocationId;
		const locations = explorerStore.getState().locations;
		const activeLocation = locations.find((l) => l.id === Number(activeLocationId));

		if (!activeLocation?.path) return null;

		// '/を'除去
		const cleanPath = currentPath === '/' ? '' : currentPath;
		return `${activeLocation.path}${cleanPath}`;
	}, [currentPath]);

	if (!currentFullPath) return null;

	return (
		<ContextMenu.Item
			label={t('open_terminal')}
			icon={Terminal}
			onClick={() => openTerminal(currentFullPath)}
		/>
	);
}
