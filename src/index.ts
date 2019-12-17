enum ResizingType {
  /**
   * resizes the image while keeping aspect ratio to fit given size;
   */
  Fit = "fit",
  /**
   * resizes the image while keeping aspect ratio to fill given size and
   * cropping projecting parts
   * */
  Fill = "fill",
  /**
   * if both source and resulting dimensions have the same orientation
   * (portrait or landscape), imgproxy will use fill. Otherwise, it will use
   * fit.
   */
  Auto = "auto"
}

interface BasicParams {
  signature: string;
  resizingType: ResizingType;
  width: number;
  height: number;
  gravity: any;
  enlarge: boolean;
  source: Source;
  extension?: Extension;
}

type Source = SourceAmazonS3 | SourceGoogleCloudStorage | SourceURL;

interface SourceAmazonS3 {
  sourceName: "amazons3";
  bucketName: string;
  fileKey: string;
  versionId?: string;
}

interface SourceGoogleCloudStorage {
  sourceName: "gcs";
  bucketName: string;
  fileKey: string;
  generation?: string;
}

interface SourceURL {
  sourceName: "url";
  url: string;
}

enum Extension {
  JPG = "jpg",
  PNG = "png",
  WEBP = "webp",
  GIF = "gif",
  ICO = "ico",
  HEIC = "heic",
  TIFF = "tiff"
}

function buildBasicPath(params: BasicParams): string {
  return [
    params.signature,
    params.resizingType,
    params.width,
    params.height,
    params.gravity,
    params.enlarge,
    buildSource(params.source)
  ]
    .concat(params.extension || [])
    .join("/");
}

function buildSource(source: Source): string {
  switch (source.sourceName) {
    case "url":
      return `plain/${encodeURIComponent(source.url)}`;
    case "amazons3":
      return `s3://${source.bucketName}/${source.fileKey}${
        source.versionId ? `?${source.versionId}` : ``
      }`;
    case "gcs":
      return `s3://${source.bucketName}/${source.fileKey}${
        source.generation ? `?${source.generation}` : ``
      }`;
  }
}
