import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { StatCard } from './StatCard';

const meta = {
  component: StatCard,
  tags: ['ai-generated'],
} satisfies Meta<typeof StatCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TotalBooks: Story = {
  args: {
    label: 'Total Buku',
    value: 42,
    hint: '12 selesai',
    icon: 'ri-book-shelf-line',
    accent: 'pale',
  },
};

export const SedangDibaca: Story = {
  args: {
    label: 'Sedang Dibaca',
    value: 3,
    hint: 'Aktif sekarang',
    icon: 'ri-book-open-line',
    accent: 'blue',
  },
};

export const Selesai: Story = {
  args: {
    label: 'Selesai',
    value: 24,
    hint: '3 berhenti',
    icon: 'ri-checkbox-circle-line',
    accent: 'pink',
  },
};

export const Rating: Story = {
  args: {
    label: 'Rata-rata Rating',
    value: '★ 4.3',
    hint: 'dari reviewmu',
    icon: 'ri-star-half-line',
    accent: 'mauve',
  },
};

export const MuteAccent: Story = {
  args: {
    label: 'Halaman Dibaca',
    value: 1820,
    hint: 'sepanjang waktu',
    icon: 'ri-file-text-line',
    accent: 'mute',
  },
};
