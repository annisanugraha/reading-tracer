import type { Meta, StoryObj } from '@storybook/nextjs-vite';
import { expect, fn } from 'storybook/test';

import { SearchFilterBar } from './SearchFilterBar';

const meta = {
  component: SearchFilterBar,
  tags: ['ai-generated'],
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SearchFilterBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    searchValue: '',
    onSearchChange: fn(),
    filterStatus: [],
    onFilterStatusChange: fn(),
    filterGenre: [],
    onFilterGenreChange: fn(),
    genreOptions: ['fiksi', 'memoar', 'teknologi', 'filsafat'],
    sort: 'terbaru',
    onSortChange: fn(),
  },
};

export const WithActiveFilters: Story = {
  args: {
    searchValue: 'sang',
    onSearchChange: fn(),
    filterStatus: ['sedang-dibaca', 'selesai'],
    onFilterStatusChange: fn(),
    filterGenre: ['fiksi'],
    onFilterGenreChange: fn(),
    genreOptions: ['fiksi', 'memoar', 'teknologi', 'filsafat'],
    sort: 'rating',
    onSortChange: fn(),
  },
  play: async ({ canvas }) => {
    const chip = canvas.getByRole('button', { name: 'Sedang Dibaca' });
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
  },
};

export const SortByJudul: Story = {
  args: {
    searchValue: '',
    onSearchChange: fn(),
    filterStatus: [],
    onFilterStatusChange: fn(),
    filterGenre: [],
    onFilterGenreChange: fn(),
    genreOptions: ['fiksi'],
    sort: 'judul',
    onSortChange: fn(),
  },
};
