import { getAllMetadataItems } from '$lib/utils/duplicate-utils';
import { assetFactory } from '@test-data/factories/asset-factory';

const $t = ((key: string) => key) as never;

const itemFor = (asset: Parameters<typeof getAllMetadataItems>[0], title: string) =>
  getAllMetadataItems(asset, $t, 'en').find((item) => item.title === title);

describe('getAllMetadataItems', () => {
  it('provides the raw full path in tooltip when originalPath is present', () => {
    const originalPath = '/mnt/media/photos/library/2024/holidays/iceland/day-07/DSC_0912_edited_final.jpg';
    const asset = assetFactory.build({ originalPath });

    const item = itemFor(asset, 'path');

    expect(item).toBeDefined();
    expect(item?.tooltip).toBe(originalPath);
    // Displayed render string remains shortened
    expect(item?.render).not.toBe(originalPath);
    expect(item?.render.length).toBeLessThan(originalPath.length);
  });

  it('provides the raw path even when path is short enough not to be truncated', () => {
    const originalPath = '/photos/a.jpg';
    const asset = assetFactory.build({ originalPath });

    const item = itemFor(asset, 'path');

    expect(item).toBeDefined();
    expect(item?.render).toBe(originalPath);
    expect(item?.tooltip).toBe(originalPath);
  });

  it('returns undefined tooltip when originalPath is empty or undefined', () => {
    const asset = assetFactory.build({ originalPath: '' });

    const item = itemFor(asset, 'path');

    expect(item).toBeDefined();
    expect(item?.tooltip).toBeUndefined();
  });

  it('returns undefined tooltip for fields without a tooltip generator', () => {
    const asset = assetFactory.build({ originalFileName: 'photo.jpg' });

    expect(itemFor(asset, 'file_name_text')?.tooltip).toBeUndefined();
    expect(itemFor(asset, 'file_size')?.tooltip).toBeUndefined();
    expect(itemFor(asset, 'resolution')?.tooltip).toBeUndefined();
  });
});
