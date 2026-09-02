import { type Client, type SimpleSchemaTypes, buildClient } from '@datocms/cma-client';
import type { NextRequest, NextResponse } from 'next/server';
import {
  handleUnexpectedError,
  invalidRequestResponse,
  successfulResponse,
  withCORS,
} from '../utils';

/*
 * This endpoint is called only once, immediately after the initial deployment of
 * this project, to set up some DatoCMS settings. Feel free to remove it!
 *
 * Everything here has to work on a project that already has these plugins. A new
 * project is a *copy* of the template, so it arrives with them installed and
 * still pointing at the template's own deployment: creating them blindly fails,
 * and the settings that matter never get written. That is how the first client
 * project ended up with the template's URL and secret in its plugin settings.
 */

/**
 * Installs the plugin only when the copy did not bring it along, and writes the
 * settings either way. Safe to run twice.
 */
async function configurePlugin(
  client: Client,
  packageName: string,
  parameters: Record<string, unknown>,
) {
  const installed = await client.plugins.list();

  const plugin =
    installed.find((candidate) => candidate.package_name === packageName) ??
    (await client.plugins.create({ package_name: packageName }));

  await client.plugins.update(plugin.id, { parameters });
}

export async function OPTIONS() {
  return new Response('OK', withCORS());
}

/**
 * Configure the "Web Previews" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-web-previews
 */
async function configureWebPreviewsPlugin(client: Client, baseUrl: string) {
  await configurePlugin(client, 'datocms-plugin-web-previews', {
    frontends: [
      {
        name: 'Production',
        previewWebhook: new URL('/api/preview-links', baseUrl).toString(),
        customHeaders: [{ name: 'Authorization', value: `Bearer ${process.env.SECRET_API_TOKEN}` }],
        visualEditing: {
          enableDraftModeUrl: new URL(
            `/api/draft-mode/enable?token=${process.env.SECRET_API_TOKEN}`,
            baseUrl,
          ).toString(),
          initialPath: '/',
        },
      },
    ],
    startOpen: true,
  });
}

/**
 * Configure the "SEO/Readability Analysis" plugin
 *
 * https://www.datocms.com/marketplace/plugins/i/datocms-plugin-seo-readability-analysis
 */
async function configureSeoAnalysisPlugin(client: Client, baseUrl: string) {
  await configurePlugin(client, 'datocms-plugin-seo-readability-analysis', {
    htmlGeneratorUrl: new URL('/api/seo-analysis', baseUrl).toString(),
    customHeaders: [{ name: 'Authorization', value: `Bearer ${process.env.SECRET_API_TOKEN}` }],
    autoApplyToFieldsWithApiKey: 'seo_analysis',
    setSeoReadabilityAnalysisFieldExtensionId: true,
  });
}

/**
 * Setup a webhook to be notified when anything changes, and invalidate Next.js cache
 *
 * Found by name rather than created blindly, so a second run updates the one
 * that is there instead of leaving the project with two.
 */
async function configureCacheInvalidationWebhook(client: Client, baseUrl: string) {
  const webhook: SimpleSchemaTypes.WebhookCreateSchema = {
    name: '🔄 Invalidate Next.js Cache',
    url: new URL('/api/invalidate-cache', baseUrl).toString(),
    custom_payload: null,
    headers: { Authorization: `Bearer ${process.env.SECRET_API_TOKEN}` },
    events: [
      {
        filters: [],
        entity_type: 'cda_cache_tags',
        event_types: ['invalidate'],
      },
    ],
    http_basic_user: null,
    http_basic_password: null,
  };

  const existing = (await client.webhooks.list()).find(({ name }) => name === webhook.name);

  if (existing) {
    await client.webhooks.update(existing.id, webhook);
    return;
  }

  await client.webhooks.create(webhook);
}

/**
 * The DatoCMS API token arrives in the request body, so without this check the
 * endpoint would happily write our SECRET_API_TOKEN into any project a caller
 * names, and the caller could then read it back from their own project.
 */
async function ensureSameProject(client: Client, ourApiToken: string) {
  const ourClient = buildClient({ apiToken: ourApiToken });

  const [callerProject, ourProject] = await Promise.all([
    client.site.find(),
    ourClient.site.find(),
  ]);

  return callerProject.id === ourProject.id;
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const body = await request.json();

  const client = buildClient({ apiToken: body.datocmsApiToken });
  const baseUrl = body.frontendUrl as string;

  try {
    if (!(await ensureSameProject(client, process.env.DATOCMS_CMA_TOKEN!))) {
      return invalidRequestResponse('Invalid token', 401);
    }

    /*
     * `allSettled`, so one failing step does not abandon the others halfway and
     * leave the project half configured. Whatever failed is named in the
     * response: this endpoint runs once, unattended, and a silent partial
     * success is what let the first client project go out misconfigured.
     */
    const steps = {
      'Web Previews plugin': configureWebPreviewsPlugin(client, baseUrl),
      'SEO/Readability Analysis plugin': configureSeoAnalysisPlugin(client, baseUrl),
      'cache invalidation webhook': configureCacheInvalidationWebhook(client, baseUrl),
    };

    const outcomes = await Promise.allSettled(Object.values(steps));

    const failures = Object.keys(steps).flatMap((step, index) => {
      const outcome = outcomes[index];

      if (outcome?.status !== 'rejected') {
        return [];
      }

      const reason = outcome.reason;
      return [`${step}: ${reason instanceof Error ? reason.message : String(reason)}`];
    });

    if (failures.length > 0) {
      console.error(failures);
      return invalidRequestResponse(`Setup incomplete. ${failures.join(' | ')}`, 500);
    }

    return successfulResponse();
  } catch (error) {
    return handleUnexpectedError(error);
  }
}
