/* Khu Trò chơi (bố cục riêng, không có đầu báo) */
import { L } from './lazy'

export const gameRoutes = [
  { path: '/tro-choi', element: L(() => import('@/pages/games/GamesHome')) },
  { path: '/tro-choi/chu-an', element: L(() => import('@/pages/games/ChuAnPage')) },
  { path: '/tro-choi/bo-tu', element: L(() => import('@/pages/games/BoTuPage')) },
  { path: '/tro-choi/sudoku', element: L(() => import('@/pages/games/SudokuPage')) },
  { path: '/tro-choi/tao-chu-an', element: L(() => import('@/pages/games/CreateChuAnPage')) },
]
