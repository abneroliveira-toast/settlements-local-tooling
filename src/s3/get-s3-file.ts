import { Readable, Stream } from 'node:stream';
import { s3Client } from './s3-client.js';
import { GetObjectCommand } from '@aws-sdk/client-s3';

export const SETTLEMENTS_KNOWN_S3_DIRECTORIES = {
  vantiv: {
    emaf: 'incoming/TOST_P0BCDNAF_${yyyymmdd}',
    withholdings_validation:
      'incoming/withholdings-validation/${yyyymmdd}_${timestamp}',
    withholdings_validation_processed:
      'incoming/withholdings-validation-processed/${yyyymmdd}_${timestamp}',
  },
  chase: {
    ACH_NIGHTLY: 'outgoing/${yyyymmdd}/TOAST.ACH.NACHA.${yymmdd}-${PID}-0',

    ACT_0010: 'incoming/${yyyymmdd}/${id}.yymmdd.d.b${seq}.dfr',
  },
};

export type S3_DIRECTORIES = keyof typeof SETTLEMENTS_KNOWN_S3_DIRECTORIES;
export type S3_VANTIV_DIRECTORIES =
  keyof (typeof SETTLEMENTS_KNOWN_S3_DIRECTORIES)['vantiv'];
export type S3_CHASE_DIRECTORIES =
  keyof (typeof SETTLEMENTS_KNOWN_S3_DIRECTORIES)['chase'];

export type BUCKETS_ENVIRONMENT = 'prod' | 'preproduction';

export const SETTLEMENTS_KNOW_BUCKETS: Record<
  S3_DIRECTORIES,
  { [K in BUCKETS_ENVIRONMENT]: string }
> = {
  vantiv: {
    preproduction: '',
    prod: 'vantiv-files',
  },
  chase: {
    preproduction: '',
    //prod: 'funds-transfer-nacha-prod',
    prod: 'cms-dfr-processing-prod',
  },
};

export async function getS3File(
  s3Bucket: string,
  s3FilePath: string
): Promise<string | undefined> {
  console.log('getS3File ');
  const getObjectResponse = await s3Client.send(
    new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3FilePath,
    })
  );
  const response = getObjectResponse.Body;
  const readable = getObjectResponse.Body as Readable;
  return Promise.resolve(response?.transformToString());
}

export async function getS3FileStream(
  s3Bucket: string,
  s3FilePath: string
): Promise<Readable | undefined> {
  const getObjectResponse = await s3Client.send(
    new GetObjectCommand({
      Bucket: s3Bucket,
      Key: s3FilePath,
    })
  );
  const response = getObjectResponse.Body;
  return getObjectResponse.Body as Readable;
}

// try {
//   const result = await getS3File(
//     'cms-dfr-processing-prod',
//     'incoming/20230621/0000256686.230621.d.A050.dfr'
//   );
//   console.log('FILE DOWNLOADED, ' + result);
// } catch (e) {
//   console.error(`ERROR: ${e}`);
// }
