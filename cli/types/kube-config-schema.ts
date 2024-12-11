import { z } from 'zod'

export const clusterSchema = z.object({
  name: z.string(),
  cluster: z.object({
    server: z.string().url(),
    'certificate-authority-data': z.string().optional(),
    'certificate-authority': z.string().optional(),
    'insecure-skip-tls-verify': z.boolean().optional(),
  }),
})

export const contextSchema = z.object({
  name: z.string(),
  context: z.object({
    cluster: z.string(),
    user: z.string(),
    namespace: z.string().optional(),
  }),
})

export const userSchema = z.object({
  name: z.string(),
  user: z.object({
    'client-certificate-data': z.string().optional(),
    'client-key-data': z.string().optional(),
    'client-certificate': z.string().optional(),
    'client-key': z.string().optional(),
    token: z.string().optional(),
    username: z.string().optional(),
    password: z.string().optional(),
    'auth-provider': z
      .object({
        name: z.string(),
        config: z.record(z.any()),
      })
      .optional(),
    exec: z
      .object({
        apiVersion: z.string(),
        command: z.string(),
        args: z.array(z.string()).optional(),
        env: z.array(z.any()).optional(),
      })
      .optional(),
  }),
})

export const kubeConfigSchema = z.object({
  apiVersion: z.literal('v1'),
  kind: z.literal('Config'),
  clusters: z.array(clusterSchema),
  contexts: z.array(contextSchema),
  'current-context': z.string(),
  preferences: z.record(z.any()).optional(),
  users: z.array(userSchema),
})

export type KubeConfig = z.infer<typeof kubeConfigSchema>
export type Cluster = z.infer<typeof clusterSchema>
export type Context = z.infer<typeof contextSchema>
export type User = z.infer<typeof userSchema>
